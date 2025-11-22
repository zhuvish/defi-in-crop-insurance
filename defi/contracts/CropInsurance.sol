// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DecentralizedCropInsurance {
    address public insurer;
    address public oracle;

    uint256 public totalPolicies;
    uint256 public reservedFunds;     // sum of payoutAmount for all active (not-yet-paid) policies

    struct Policy {
        address farmer;
        uint256 premiumPaid;      // wei
        uint256 payoutAmount;     // wei
        uint256 rainfallThreshold; // mm
        uint256 startAt;          // timestamp (0 = immediate)
        uint256 endAt;            // timestamp (0 = no expiry)
        string location;
        bool active;              // active until paid/cancelled
        bool paidOut;             // whether payout occurred
    }

    mapping(address => Policy) public policies; // one policy per farmer for simplicity

    event PoolFunded(address indexed from, uint256 amount);
    event PolicyBought(address indexed farmer, uint256 premium, uint256 payoutAmount, uint256 rainfallThreshold);
    event PolicyCancelled(address indexed farmer, uint256 refunded);
    event PayoutExecuted(address indexed farmer, uint256 payoutAmount, uint256 rainfall);
    event ProfitWithdrawn(address indexed insurer, uint256 amount);
    event OracleChanged(address indexed oldOracle, address indexed newOracle);

    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle || msg.sender == insurer, "Only oracle/insurer");
        _;
    }

    modifier noReentrant() {
        require(_locked == 0, "Reentrant");
        _locked = 1;
        _;
        _locked = 0;
    }

    uint256 private _locked;

    constructor(address _oracle) payable {
        insurer = msg.sender;
        oracle = _oracle;
        reservedFunds = 0;
        totalPolicies = 0;
        _locked = 0;

        // If insurer sends ETH on deployment, treat it as initial pool funding
        if (msg.value > 0) {
            emit PoolFunded(msg.sender, msg.value);
        }
    }

    // Admin / Insurer functions

    /// @notice change oracle address
    function setOracle(address _oracle) external onlyInsurer {
        address old = oracle;
        oracle = _oracle;
        emit OracleChanged(old, _oracle);
    }

    /// @notice Fund the payout pool. Insurer (or anyone) can send ETH to increase pool.
    function fundPool() external payable {
        require(msg.value > 0, "Send ETH to fund pool");
        emit PoolFunded(msg.sender, msg.value);
    }

    /// @notice Withdraw available profit (contract balance minus reserved funds)
    function withdrawProfit(uint256 amount) external onlyInsurer noReentrant {
        uint256 available = address(this).balance - reservedFunds;
        require(amount <= available, "Amount exceeds available profit");
        (bool sent, ) = payable(insurer).call{value: amount}("");
        require(sent, "Withdraw failed");
        emit ProfitWithdrawn(insurer, amount);
    }

    // ----------------------------
    // Farmer-facing functions
    // ----------------------------

    /// @notice Buy a policy by sending premium to contract. One active policy per farmer in this simple model.
    /// @param _payoutAmount amount that will be paid on trigger (wei)
    /// @param _rainfallThreshold rainfall threshold (mm)
    /// @param _startAt policy start unix timestamp (0 = immediate)
    /// @param _endAt policy end unix timestamp (0 = no expiry)
    /// @param _location optional location string
    function buyPolicy(
        uint256 _payoutAmount,
        uint256 _rainfallThreshold,
        uint256 _startAt,
        uint256 _endAt,
        string calldata _location
    ) external payable {
        require(msg.value > 0, "Premium required");
        require(_payoutAmount > 0, "Payout must be > 0");
        require(policies[msg.sender].active == false, "Existing active policy");

        // Record policy
        policies[msg.sender] = Policy({
            farmer: msg.sender,
            premiumPaid: msg.value,
            payoutAmount: _payoutAmount,
            rainfallThreshold: _rainfallThreshold,
            startAt: _startAt,
            endAt: _endAt,
            location: _location,
            active: true,
            paidOut: false
        });

        // Increase reserved funds so insurer cannot withdraw these obligations
        reservedFunds += _payoutAmount;
        totalPolicies += 1;

        emit PolicyBought(msg.sender, msg.value, _payoutAmount, _rainfallThreshold);
    }

    /// @notice Farmer may cancel before payout and get full refund of premiumPaid. Reserved funds are reduced accordingly.
    function cancelPolicy() external noReentrant {
        Policy storage p = policies[msg.sender];
        require(p.active, "No active policy");
        require(!p.paidOut, "Already paid out");

        uint256 refund = p.premiumPaid;

        // Clear policy before transfer
        p.active = false;
        p.paidOut = true;

        // Reduce reserved funds (insurer obligation freed)
        if (reservedFunds >= p.payoutAmount) {
            reservedFunds -= p.payoutAmount;
        } else {
            reservedFunds = 0;
        }

        // Transfer refund
        (bool sent, ) = payable(p.farmer).call{value: refund}("");
        require(sent, "Refund failed");

        emit PolicyCancelled(p.farmer, refund);
    }

    // ----------------------------
    // Oracle / Trigger functions
    // ----------------------------

    /// @notice Called by oracle (or insurer in demo) to evaluate rainfall and issue payout if condition met
    /// @param farmerAddr address of farmer whose policy to evaluate
    /// @param rainfall measured rainfall in mm
    function triggerPayout(address farmerAddr, uint256 rainfall) external onlyOracle noReentrant {
        Policy storage p = policies[farmerAddr];
        require(p.active, "Policy not active");
        require(!p.paidOut, "Already paid");

        // Check time windows if set
        if (p.startAt != 0) {
            require(block.timestamp >= p.startAt, "Policy not started");
        }
        if (p.endAt != 0) {
            require(block.timestamp <= p.endAt, "Policy expired");
        }

        // emit oracle read
        // If condition met, execute payout
        if (rainfall < p.rainfallThreshold) {
            // ensure pool has funds
            require(address(this).balance >= p.payoutAmount, "Insufficient pool balance");

            // mark before transferring
            p.paidOut = true;
            p.active = false;

            // reduce reserved funds
            if (reservedFunds >= p.payoutAmount) {
                reservedFunds -= p.payoutAmount;
            } else {
                reservedFunds = 0;
            }

            (bool sent, ) = payable(p.farmer).call{value: p.payoutAmount}("");
            require(sent, "Payout transfer failed");

            emit PayoutExecuted(p.farmer, p.payoutAmount, rainfall);
        }
        // if condition not met, do nothing; oracle logs can be captured off-chain
    }

    // ----------------------------
    // Views / Helpers
    // ----------------------------

    /// @notice Returns contract available profit (not reserved)
    function availableProfit() public view returns (uint256) {
        uint256 bal = address(this).balance;
        if (bal <= reservedFunds) return 0;
        return bal - reservedFunds;
    }

    /// @notice Get policy summary for a farmer
    function getPolicyFor(address farmerAddr) external view returns (
        address _farmer,
        uint256 _premiumPaid,
        uint256 _payoutAmount,
        uint256 _rainfallThreshold,
        uint256 _startAt,
        uint256 _endAt,
        string memory _location,
        bool _active,
        bool _paidOut
    ) {
        Policy storage p = policies[farmerAddr];
        return (
            p.farmer,
            p.premiumPaid,
            p.payoutAmount,
            p.rainfallThreshold,
            p.startAt,
            p.endAt,
            p.location,
            p.active,
            p.paidOut
        );
    }

    // Accept ETH to the pool
    receive() external payable {
        emit PoolFunded(msg.sender, msg.value);
    }
}
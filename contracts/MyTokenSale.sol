pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale{

    KycContract kyc;

    constructor (
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) 

    Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _postValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycStatus(msg.sender), "KYC is not set yet, process not allowed");
    }
}
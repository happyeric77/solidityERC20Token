pragma solidity ^0.8.0;

// Many path has changed, modify it to correct path.
// If not, imports of undefined will show. 
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Crowdsale is Context, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _token;

    address payable private _wallet;

    uint256 private _rate;

    uint256 private _weiRaised;

    
    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    
    // remove the public keyword since Visibility ( public / external ) is not needed for constructors anymore >0.7.0
    constructor (uint256 myrate, address payable mywallet, IERC20 mytoken) {
        require(myrate > 0, "Crowdsale: rate is 0");
        require(mywallet != address(0), "Crowdsale: wallet is the zero address");
        require(address(mytoken) != address(0), "Crowdsale: token is the zero address");

        _rate = myrate;
        _wallet = mywallet;
        _token = mytoken;
    }

    // Modify it from fullback to receive
    receive () external payable {
        buyTokens(_msgSender());
    }

    
    
    function token() public view returns (IERC20) {
        return _token;
    }


    function wallet() public view returns (address payable) {
        return _wallet;
    }


    function rate() public view returns (uint256) {
        return _rate;
    }

    
    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    
    function buyTokens(address beneficiary) public nonReentrant payable {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        _weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _updatePurchasingState(beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(beneficiary, weiAmount);
    }

    
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }

    
    function _postValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    
    function _processPurchase(address beneficiary, uint256 tokenAmount) internal virtual {
        _deliverTokens(beneficiary, tokenAmount);
    }

    
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    
    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.mul(_rate);
    }

    function _forwardFunds() internal virtual {
        _wallet.transfer(msg.value);
    }
}
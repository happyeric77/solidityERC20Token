pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {

    mapping ( address => bool) allowed;

    function setKeyCompleted (address _addr) public onlyOwner  {
        allowed[_addr] = true;
    }
    
    function setKeyRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycStatus(address _addr) public view returns(bool) {
        return allowed[_addr];
    }

}
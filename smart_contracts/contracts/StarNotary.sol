pragma solidity ^ 0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string starStory;
        string ra;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public starCoordinatesToTokenId;
    
    event starCreated(address _owner);

    function createStar(string _name, string _story, string _ra, string _dec, string _mag, uint256 _tokenId) public {
        //Verify uniquenessFactor 
        require(!this.checkIfStarExist(_ra, _dec, _mag));

        // Create a Star memory newStar variable
        Star memory newStar = Star(_name, _story, _ra, _dec, _mag);

        tokenIdToStarInfo[_tokenId] = newStar;

        starCoordinatesToTokenId[this.generateStarCoordinatesHash(_ra, _dec, _mag)] = true;

        mint(_tokenId);

        emit starCreated(msg.sender);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        // require owner in the token is equal to msg.sender 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        // Verify if the star is for sale 
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        // Verify you have amount
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        // If everything is okay transfer
        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns(bool) {
        return starCoordinatesToTokenId[this.generateStarCoordinatesHash(_ra, _dec, _mag)];
    }

    function generateStarCoordinatesHash(string _ra, string _dec, string _mag) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(_ra, _dec, _mag));
    }

    function mint(uint256 _tokenId) public {
        _mint(msg.sender, _tokenId);
    }

    function approve(uint256 _tokenId) public {
        ERC721.approve(msg.sender, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        ERC721.safeTransferFrom(_from, _to, _tokenId);
    }

    function setApprovalForAll(address _to, bool _approved) public {
        ERC721.setApprovalForAll(_to, _approved);
    }

    function getApproved(uint256 _tokenId) public view returns(address) {
        return ERC721.getApproved(_tokenId);
    }

    function isApprovedForAll(address _owner, address _operator) public view returns(bool) {
        return ERC721.isApprovedForAll(_owner, _operator);
    }

    function ownerOf(uint256 _tokenId) public view returns(address) {
        return ERC721.ownerOf(_tokenId);
    }

    function starsForSale(uint256 _tokenId) public {

    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string) {
        return (tokenIdToStarInfo[_tokenId].name, tokenIdToStarInfo[_tokenId].starStory, tokenIdToStarInfo[_tokenId].ra, tokenIdToStarInfo[_tokenId].dec, tokenIdToStarInfo[_tokenId].mag);
    }
}
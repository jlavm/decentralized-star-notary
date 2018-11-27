const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    let defaultAccount = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]

    let name = 'Star power 103!'
    let starStory = "I love my wonderful star"
    let ra = "ra_032.155"
    let dec = "dec_121.874"
    let mag = "mag_245.978"
    let starId = 1
    let starIdTwo = 2

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount});
    });

    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: user1});
        
            assert.deepEqual(await this.contract.tokenIdToStarInfo(starId), [name, starStory, ra, dec, mag]);
        })
    });

     describe('Check if star exist', () => {

        beforeEach(async function () { 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: defaultAccount});
        })

        it('Check if star is already assigned', async () => {
            assert.equal(await this.contract.checkIfStarExist(ra, dec, mag, {from: defaultAccount}), true);
        });
    })

    describe('star uniqueness', () => { 

        beforeEach(async () => { 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: user1});  
        });

        it('only stars unique stars can be minted', async function() { 
            await expectThrow(this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: user1}));
        })

        it('only stars unique stars can be minted even if their ID is different', async function() { 
            await expectThrow(this.contract.createStar(name, starStory, ra, dec, mag, starIdTwo, {from: user1}));
        })

        it('minting unique stars does not fail', async function() { 
            for(let i = 0; i < 10; i ++) { 
                let id = i
                let newRa = i.toString()
                let newDec = i.toString()
                let newMag = i.toString()

                await this.contract.createStar(name, starStory, newRa, newDec, newMag, id, {from: user1});

                let starInfo = await this.contract.tokenIdToStarInfo(id)
                assert.equal(starInfo[0], name)
            }
        })
    });

    describe('buying and selling stars', () => { 

        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: user1});
        })

        it('user1 can put up their star for sale', async function () { 
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1});

            assert.equal(await this.contract.starsForSale(starId), starPrice);
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1});
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice});

                assert.equal(await this.contract.ownerOf(starId), user2);
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
            })
        })
    })
});

var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return 
    }

    assert.fail('expected an error, but none was found')
}
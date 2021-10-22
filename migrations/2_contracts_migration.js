const Emed = artifacts.require('Emed');
const Token = artifacts.require('IRSTKN');

module.exports = function (deployer) {
  deployer
    .deploy(Token, 1000)
    .then(() => {
      return Token.address;
    })
    .then((token_address) => {
      return deployer.deploy(Emed, token_address);
    });
};

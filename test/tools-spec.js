var expect = require("chai").expect;
var tools = require("../lib/tools/tools.js");

describe("Tools", function () {

  describe("printName()", function () {
    it("should print the last name first", function () {
      var results = tools.printName({
        first: 'Matt',
        last: 'Mazur'
      });
      expect(results).to.equal('Mazur, Matt');
    });
  });

  describe("loadWiki()", function() {

    this.timeout(5000);

    it("should load the wiki page", function(done) {
      tools.loadWiki({first:'Abraham', last:'Lincoln'}, function(html) {
        expect(html).to.be.ok;
        done();
      })
    });
  });
});

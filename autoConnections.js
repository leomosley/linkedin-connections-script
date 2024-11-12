/* SEARCH PAGES:
UoP Computer Science:
https://www.linkedin.com/search/results/people/?keywords=university%20of%20portsmouth%20computer%20science&network=%5B%22F%22%2C%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&sid=_pG

Software Engineer:
https://www.linkedin.com/search/results/people/?keywords=software%20engineer&network=%5B%22F%22%2C%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&searchId=a005a81c-2cb4-490f-b20a-c2f5ddf7a151&sid=-am

Next.js:
https://www.linkedin.com/search/results/people/?keywords=Next.js&network=%5B%22F%22%2C%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&searchId=a005a81c-2cb4-490f-b20a-c2f5ddf7a151&sid=-am

Fullstack:
https://www.linkedin.com/search/results/people/?keywords=fullstack&network=%5B%22F%22%2C%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&searchId=a005a81c-2cb4-490f-b20a-c2f5ddf7a151&sid=-am
*/

Linkedin = {
  config: {
    scrollDelay: 1000,
    actionDelay: 500,
    nextPageDelay: 500,
    maxRequests: -1,
    totalRequestsSent: 0,
  },
  init: function (data, config) {
    console.info("INFO: script initialized on the page...");

    console.debug(
      "DEBUG: scrolling to bottom in " + config.scrollDelay + " ms"
    );
    setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
  },
  scrollBottom: function (data, config) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    console.debug("DEBUG: scrolling to top in " + config.scrollDelay + " ms");

    setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
  },
  scrollTop: function (data, config) {
    window.scrollTo({ top: 0, behavior: "smooth" });

    console.debug(
      "DEBUG: inspecting elements in " + config.scrollDelay + " ms"
    );

    setTimeout(() => this.inspect(data, config), config.scrollDelay);
  },
  inspect: function (data, config) {
    var totalRows = this.totalRows();

    console.debug("DEBUG: total search results found on page are " + totalRows);

    if (totalRows >= 0) {
      this.compile(data, config);
    } else {
      console.warn("WARN: end of search results!");
      this.complete(config);
    }
  },
  compile: function (data, config) {
    var elements = document.querySelectorAll("button");

    data.pageButtons = [...elements].filter(function (element) {
      return element.textContent.trim() === "Connect";
    });

    if (!data.pageButtons || data.pageButtons.length === 0) {
      console.warn("ERROR: no connect buttons found on page!");
      console.info("INFO: moving to next page...");
      setTimeout(() => {
        this.nextPage(config);
      }, config.nextPageDelay);
    } else {
      data.pageButtonTotal = data.pageButtons.length;
      console.info("INFO: " + data.pageButtonTotal + " connect buttons found");
      data.pageButtonIndex = 0;
      console.debug(
        "DEBUG: starting to send invites in " + config.actionDelay + " ms"
      );
      setTimeout(() => {
        this.sendInvites(data, config);
      }, config.actionDelay);
    }
  },
  sendInvites: function (data, config) {
    console.debug("remaining requests " + config.maxRequests);

    if (config.maxRequests == 0) {
      console.info("INFO: max requests reached for the script run!");
      this.complete(config);
    } else {
      console.debug(
        "DEBUG: sending invite to " +
        (data.pageButtonIndex + 1) +
        " out of " +
        data.pageButtonTotal
      );
      var button = data.pageButtons[data.pageButtonIndex];
      button.click();
      console.debug(
        "DEBUG: clicking send in popup, if present, in " +
        config.actionDelay +
        " ms"
      );
      setTimeout(() => this.clickSend(data, config), config.actionDelay);
    }
  },
  clickSend: function (data, config) {
    var buttons = document.querySelectorAll("button");

    var sendButton = Array.prototype.filter.call(buttons, function (el) {
      return el.textContent.trim() === "Send without a note";
    });

    // Click the first send button
    if (sendButton && sendButton[0]) {
      console.debug("DEBUG: clicking send button to close popup");
      sendButton[0].click();
    } else {
      console.debug(
        "DEBUG: send button not found, clicking close on the popup in " +
        config.actionDelay
      );
    }

    setTimeout(() => this.clickClose(data, config), config.actionDelay);
  },
  clickClose: function (data, config) {
    var closeButton = document.getElementById("ember1683");

    if (closeButton) {
      closeButton.click();
    }

    console.info(
      "INFO: invite sent to " +
      (data.pageButtonIndex + 1) +
      " out of " +
      data.pageButtonTotal
    );

    config.maxRequests--;
    config.totalRequestsSent++;

    if (data.pageButtonIndex === data.pageButtonTotal - 1) {
      console.debug(
        "DEBUG: all connections for the page done, going to next page in " +
        config.actionDelay +
        " ms"
      );
      setTimeout(() => this.nextPage(config), config.actionDelay);
    } else {
      data.pageButtonIndex++;
      console.debug(
        "DEBUG: sending next invite in " + config.actionDelay + " ms"
      );
      setTimeout(() => this.sendInvites(data, config), config.actionDelay);
    }
  },
  nextPage: function (config) {
    var pagerButton = document.getElementsByClassName(
      "artdeco-pagination__button--next"
    );

    if (
      !pagerButton ||
      pagerButton.length === 0 ||
      pagerButton[0].hasAttribute("disabled")
    ) {
      console.info("INFO: no next page button found!");
      return this.complete(config);
    }

    console.info("INFO: Going to next page...");
    pagerButton[0].click();
    setTimeout(() => this.init({}, config), config.nextPageDelay);
  },
  complete: function (config) {
    console.info(
      "INFO: script completed after sending " +
      config.totalRequestsSent +
      " connection requests"
    );
  },
  totalRows: function () {
    var search_results = document.getElementsByClassName("search-result");
    if (search_results && search_results.length != 0) {
      return search_results.length;
    } else {
      return 0;
    }
  },
};

Linkedin.init({}, Linkedin.config);
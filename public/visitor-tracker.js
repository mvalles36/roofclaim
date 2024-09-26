(function() {
  "use strict";

  const visitorTrackingFunctions = {
    appId: null,
    visitorId: null,
    host: null,

    onLoad: function({ appId }) {
      this.appId = appId;
      this.host = `${appId}/api/v1/website_visitors`;
      this.visitorId = this.getVisitorId();

      let currentPage = location.href;
      this.sendPageVisitEvent(currentPage);

      let startTime = Date.now();

      window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        this.sendPageVisitEvent(currentPage, timeOnPage);
      });

      let self = this;
      document.body.addEventListener("click", () => {
        requestAnimationFrame(() => {
          if (currentPage !== location.href) {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            self.sendPageVisitEvent(currentPage, timeOnPage);
            currentPage = location.href;
            startTime = Date.now();
          }
        });
      }, true);
    },

    sendPageVisitEvent: function(page, timeOnPage = 0) {
      const event = {
        visitor_id: this.visitorId,
        page: page,
        time_on_page: timeOnPage,
        visited_at: new Date().toISOString()
      };

      fetch(this.host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => console.error('Error:', error));
    },

    getVisitorId: function() {
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        visitorId = this.generateUUID();
        localStorage.setItem('visitorId', visitorId);
      }
      return visitorId;
    },

    generateUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };

  window.visitorTrackingFunctions = visitorTrackingFunctions;
})();
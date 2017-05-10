
    function GetActivitiesAsync (userId) {
    var url = 'http://www.theoutdoorlogbook.com/api/activities/' + userId;
            return fetch(url)
                .then(function(data) { return data.json(); })
                .then(function(actualData) {
                    // Get all activities
                    var activities = [];
                    for (i = 0; i < actualData.length; i++) {
                        if (activities.indexOf(actualData[i].ActivityId) == -1) {
                            activities.push(actualData[i].ActivityId);

                        }
                    }
                    // Store in AsyncStorage as JSON objects by activity

                }.bind(this))
                .catch(function(error) {
                    // If there is any error you will catch them here
                });
    }

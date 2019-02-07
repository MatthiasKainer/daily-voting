import map from './resultMapper';
const { DateTime } = require('luxon');

describe("Mapping Results", () => {
    describe("Given I want to map a set of votes", () => {
        const data = [
            { "_id": "5be20ab24a425f134c75380a", "rating": 1, "date": "2018-12-06T21:42:10.642Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20ab24a425f134c75380a", "rating": 1, "date": "2018-11-06T21:42:10.642Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20b51e222ea13e05f9536", "rating": 1, "date": "2018-11-06T21:44:49.513Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20bd012e99f1412b9a6ce", "rating": 1, "date": "2018-11-06T21:45:53.505Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20da4341fb915fe722184", "rating": 1, "date": "2018-11-06T21:54:44.798Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20f204b89bd16b804c666", "rating": 1, "date": "2018-11-06T22:01:04.922Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be20f694b89bd16b804c668", "rating": -1, "date": "2018-11-06T22:02:17.669Z", "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be2102c97ddae18c5394dd6", "date": "2018-11-06T22:05:32.370Z", "rating": 1, "question": "Do you have the materials, equipment and support you need to do your work right?" },
            { "_id": "5be46d415783888a8013280e", "date": "2018-11-08T17:07:13.282Z", "rating": 1, "question": "In the past seven days, have you received recognition or praise for good work?" }];

        const expected = [
            {
                "series": "Iteration 0",
                "data": [{
                    "x": "Do you have the materials, equipment and support you need to do your work right?", 
                    "y": 0.7142857142857143
                }, {
                    "x": "In the past seven days, have you received recognition or praise for good work?", 
                    "y": 1
                }]
            },
            {
                "series": "Iteration 1",
                "data": [{
                    "x": "Do you have the materials, equipment and support you need to do your work right?", 
                    "y": 1
                }]
            }
        ]

        it("Should return the right result set", () => {
            const result = map(data);
            expect(result).toEqual(expected);
        });
    });

});
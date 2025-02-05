// // Sample data (replace this with your actual data from the database)
// const efficiencyData = [
//     {
//         state: 'state1',
//         district: 'district1',
//         mandal: 'mandal1',
//         certificates: {
//             caste: { averageTime: 2 },
//             income: { averageTime: 4 },
//             ews: { averageTime: 6 }
//         }
//     },
//     {
//         state: 'state1',
//         district: 'district2',
//         mandal: 'mandal1',
//         certificates: {
//             caste: { averageTime: 3 },
//             income: { averageTime: 5 },
//             ews: { averageTime: 7 }
//         }
//     },
//     // Add more data here
// ];

// // Function to calculate efficiency for each certificate type
// const calculateEfficiency = () => {
//     return efficiencyData;
// };

// // Function to group efficiency data by state, district, or mandal
// const groupEfficiencyData = (efficiencyData, level) => {
//     const groupedData = {};

//     efficiencyData.forEach(location => {
//         const key = level === 'state' ? location.state
//                     : level === 'district' ? `${location.state}-${location.district}`
//                     : `${location.state}-${location.district}-${location.mandal}`;

//         if (!groupedData[key]) {
//             groupedData[key] = {
//                 state: location.state,
//                 district: level !== 'state' ? location.district : undefined,
//                 mandal: level === 'mandal' ? location.mandal : undefined,
//                 certificates: { caste: [], income: [], ews: [] },
//             };
//         }

//         ['caste', 'income', 'ews'].forEach(type => {
//             groupedData[key].certificates[type].push(location.certificates[type].averageTime);
//         });
//     });

//     return Object.values(groupedData).map(location => {
//         ['caste', 'income', 'ews'].forEach(type => {
//             const times = location.certificates[type];
//             const total = times.reduce((sum, t) => sum + Number(t), 0);
//             const average = times.length ? total / times.length : 0;
//             location.certificates[type] = {
//                 averageTime: average.toFixed(2),
//                 efficiency: average <= (type === 'caste' ? 2 : type === 'income' ? 3 : 5) ? 'Efficient' : 'Inefficient',
//             };
//         });
//         return location;
//     });
// };

// module.exports = { calculateEfficiency, groupEfficiencyData };
const User = require('../models/User');

// Function to calculate the efficiency of certificate processing
exports.calculateEfficiency = async (req, res) => {
    try {
        // Fetch all users with application data
        const users = await User.find();

        // Initialize a container for grouped data
        let groupedData = {};

        // Group the data by state, district, and mandal
        users.forEach(user => {
            const levels = ['state', 'district', 'mandal'];

            levels.forEach(level => {
                let levelKey = user[`${level}Application`].state;
                if (level === 'district') {
                    levelKey = `${user[`${level}Application`].state}-${user[`${level}Application`].district}`;
                } else if (level === 'mandal') {
                    levelKey = `${user[`${level}Application`].state}-${user[`${level}Application`].district}-${user[`${level}Application`].mandal}`;
                }

                if (!groupedData[levelKey]) {
                    groupedData[levelKey] = { caste: [], income: [], ews: [] };
                }

                // Add times for each certificate type (Caste, Income, EWS)
                ['caste', 'income', 'ews'].forEach(type => {
                    if (user[`${type}Application`].actualDate && user[`${type}Application`].expectedDate) {
                        const expected = new Date(user[`${type}Application`].expectedDate);
                        const actual = new Date(user[`${type}Application`].actualDate);
                        const diff = (actual - expected) / (1000 * 3600 * 24); // Time in days
                        groupedData[levelKey][type].push(diff);
                    }
                });
            });
        });

        // Calculate average time and efficiency for each group
        const efficiencyData = Object.keys(groupedData).map(group => {
            const groupData = groupedData[group];
            let result = { group };

            ['caste', 'income', 'ews'].forEach(type => {
                const total = groupData[type].reduce((sum, time) => sum + time, 0);
                const average = groupData[type].length ? total / groupData[type].length : 0;
                result[`${type}Average`] = average.toFixed(2);
                result[`${type}Efficiency`] = average <= (type === 'caste' ? 2 : type === 'income' ? 3 : 5) ? 'Efficient' : 'Inefficient';
            });

            return result;
        });

        // Send the data as a response (could be rendered as a table in the front end)
        res.json(efficiencyData);

    } catch (error) {
        console.error('Error calculating efficiency:', error);
        res.status(500).json({ message: 'Error calculating efficiency' });
    }
};

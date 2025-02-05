function calculateEfficiency(efficiencyData) {
    const groupEfficiencyData = (level) => {
        const groupedData = {};

        efficiencyData.forEach(location => {
            const key =
                level === 'state' ? location.state
                : level === 'district' ? `${location.state}-${location.district}`
                : `${location.state}-${location.district}-${location.mandal}`;

            if (!groupedData[key]) {
                groupedData[key] = {
                    state: location.state,
                    district: level !== 'state' ? location.district : undefined,
                    mandal: level === 'mandal' ? location.mandal : undefined,
                    certificates: { caste: [], income: [], ews: [] },
                };
            }

            ['caste', 'income', 'ews'].forEach(type => {
                groupedData[key].certificates[type].push(
                    location.certificates[type].averageTime
                );
            });
        });

        return Object.values(groupedData).map(location => {
            ['caste', 'income', 'ews'].forEach(type => {
                const times = location.certificates[type];
                const total = times.reduce((sum, t) => sum + Number(t), 0);
                const average = times.length ? total / times.length : 0;
                location.certificates[type] = {
                    averageTime: average.toFixed(2),
                    efficiency:
                        average <= (type === 'caste' ? 2 : type === 'income' ? 3 : 5)
                            ? 'Efficient'
                            : 'Inefficient',
                };
            });
            return location;
        });
    };

    return {
        stateEfficiency: groupEfficiencyData('state'),
        districtEfficiency: groupEfficiencyData('district'),
        mandalEfficiency: groupEfficiencyData('mandal'),
    };
}

module.exports = calculateEfficiency;

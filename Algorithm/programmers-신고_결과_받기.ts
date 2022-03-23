function solution4(id_list: string[], report: string[], k: number) {
  const reporterMapByUser = report.reduce((acc, value) => {
    const reporter = value.split(" ")[0];
    const user = value.split(" ")[1];

    acc[user] = { ...acc[user], [reporter]: true };
    return acc;
  }, {});

  const receiverList = Object.entries(reporterMapByUser).reduce(
    (acc, [user, reporterMap]) => {
      const reporterList = Object.keys(reporterMap);

      if (reporterList.length >= k) {
        acc = [...acc, ...reporterList];
      }

      return acc;
    },
    []
  );

  const countMap = receiverList.reduce((acc, user) => {
    if (acc[user]) {
      acc[user] += 1;
    } else {
      acc[user] = 1;
    }

    return acc;
  }, {});

  return id_list.reduce((acc, id) => {
    acc.push(countMap[id] || 0);
    return acc;
  }, []);
}

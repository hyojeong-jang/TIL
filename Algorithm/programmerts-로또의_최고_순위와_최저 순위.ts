function solution(lottos: number[], win_nums: number[]) {
  const wonNumList = [];
  const zeroList = [];

  const winNumMap = win_nums.reduce((acc, num) => {
    return { ...acc, [num]: num };
  }, {});

  lottos.forEach((num) => {
    if (!!winNumMap[`${num}`]) {
      wonNumList.push(num);
    } else if (num === 0) {
      zeroList.push(num);
    }
  });

  const rank = {
    6: 1,
    5: 2,
    4: 3,
    3: 4,
    2: 5,
    1: 6,
    0: 6,
  };

  const best = wonNumList.length + zeroList.length;
  const worst = wonNumList.length === 6 ? 6 : 6 - best;

  return [rank[best], rank[worst]];
}

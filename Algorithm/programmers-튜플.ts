function solution6(s) {
  const result = [];
  const reg = /[^\w\sㄱ-힣,]|[\_]/g;

  const countByNumber = s
    .replace(reg, "")
    .split(",")
    .reduce((acc, n) => {
      if (acc[n]) {
        const temp = (acc[n] += 1);
        acc[n] = temp;
      } else {
        acc[n] = 1;
      }

      return acc;
    }, {});

  let count = Object.values(countByNumber);
  let j = 0;
  const num = Object.keys(countByNumber).map((str) => Number(str));

  while (j < num.length) {
    j += 1;

    const i = count.indexOf(Math.max(...count));

    result.push(num[i]);

    count[i] = 0;
  }

  return result;
}

console.log(solution6("{{20,111},{111}}"));
console.log(solution6("{{2},{2,1},{2,1,3},{2,1,3,4}}"));

// 다른 사람의 풀이: n 사이즈 집합에서 n-1 사이즈 집합을 빼면 그 원소가 n번째 튜플의 원소라는 공식 추출 후, Set 사용
function solution7(s) {
  let answer = [];

  let newArr = JSON.parse(s.replace(/{/g, "[").replace(/}/g, "]"));

  newArr.sort((a, b) => {
    return a.length - b.length;
  });

  let temp = [];

  for (let i = 0; i < newArr.length; i++) {
    for (let j = 0; j < newArr[i].length; j++) {
      temp.push(newArr[i][j]);
    }
  }

  answer = [...new Set(temp)];
  return answer;
}

console.log(solution7("{{4,2,3},{3},{2,3,4,1},{2,3}}"));

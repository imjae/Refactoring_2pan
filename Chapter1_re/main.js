const plays = {
  "hamlet": {
    name: "Hamlet",
    type: "tragedy",
  },
  "as-like": {
    name: "As You Like It",
    type: "comedy",
  },
  "othello": {
    name: "Othello",
    type: "tragedy",
  },
};

const invoices = [
  {
    customer: "BigCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  },
];

const statement = (invoice, plays) => {
  let totalAmout = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  const amountFor = (aPerformance, play) => {
    let result = 0;

    switch (play.type) {
      case "tragedy": // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy": // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 1000 * (aPerformance.audience - 30);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${play.type}`);
    }

    return result;
  };

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  for (let perf of invoice.performances) {
    let thisAmount = amountFor(perf, playFor(perf));

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAmout += thisAmount;
  }

  result += `총액: ${format(totalAmout/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
};

// 커밋 테스트 위한 주석
console.log(statement(invoices[0], plays));
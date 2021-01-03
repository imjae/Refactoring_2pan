let plays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
};

let invoices = [
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

function statement(invoices, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoices.customer})\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;

    // 별도 함수로 빼냈을 때 유효범위를 벗어나는 변수, 즉 새 함수에서는 곧바로 사용할 수 없는 변수가 있는지 확인한다.
    // 이번 예에서는 perf, play, thisAmount가 여기 속한다.
    // perf와 play는 추출한 새 함수에서도 필요하지만 값을 변경하지 않기 때문에 매개변수로 전달하면 된다.
    // 한편 thisAmount는 함수 안에서 값이 바뀌는데, 이런 변수는 조심해서 다뤄야 한다.
    // 이번 예에서는 이런 변수가 하나뿐이므로 이 값을 반환하도록 작성했다.
    function amountFor(aPerformance) {
        // 변수의 이름을 명확하게 바꾸기 resultAmount -> result
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy": {
                // 비극
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            }
            case "comedy": {
                // 희극
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            }
            default:
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        // 포인트를 적립한다.
        result += Math.max(aPerformance.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    for (let perf of invoices.performances) {
        // 1. 임시변수 질의 함수로 변경하기
        //    const play = plays[perf.playID];
        // 2. 변수 인라인하기
        //    const play = playFor(perf);
        // 3. 변수 인라인하기
        //    let thisAmount = amountFor(perf);

        volumeCredits += volumeCreditsFor(perf);

        // 청구 내역을 출력한다.
        result += `    ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience
            }석)\n`;
        totalAmount += amountFor(perf);
    }

    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립 포인트 : ${volumeCredits}점\n`;
    return result;
}

console.log(statement(invoices[0], plays));

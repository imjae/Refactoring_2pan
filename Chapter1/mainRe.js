
var plays = {
    "hamlet" : {
        "name": "Hamlet",
        "type": "tragedy"
    },
    "as-like" : {
        "name": "As You Like It",
        "type": "comedy"
    },
    "othello" : {
        "name": "Othello",
        "type": "tragedy"
    }
};

var invoices = 
[
    {
        "customer": "BigCo",
        "performances": [
            {
                "playID": "hamlet",
                "audience": 55
            },
            {
                "playID": "as-like",
                "audience": 35
            },
            {
                "playID": "othello",
                "audience": 40
            }
        ]
    }
];


function statement(invoice, plays) {
    let result = `청구 내역 (고객명 : ${invoice.customer})\n`;

    for (let perf of invoice.performances) {
        //  청구 내역을 출력한다.
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }

    result += `총액 : ${usd(totalAmount(invoice))}\n`;
    result += `적립 포인트: ${totalVolumeCredits(invoice)}점\n`;
    
    return result;
}

function totalAmount(invoice) {        
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf);
    }
    return result;
}

function totalVolumeCredits(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += voumeCreditsFor(perf);
    }
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber/100);
}

function voumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if("comedy" === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}


function amountFor(aPerformance) {
    //  aPerformance 변수의 경우 함수를 사용하는 loof 변수에서 오기때문에 반복문을 한번 돌때마다 자연스럽게 값이 변경된다.
    //  하지만 play 는 aPerformance 에서 얻기 때문에 애초에 매개변수로 전달할 필요가 없다.
    //  amoutFor 함수에서 다시 계산하면 된다.
    let result = 0;
    switch(playFor(aPerformance).type) {
        case "tragedy": // 비극
            result = 40000;
            if(aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if(aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
    }

    return result;
}

alert(statement(invoices[0], plays));
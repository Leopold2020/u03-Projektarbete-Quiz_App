
async function getToken(existingToken) {
    try {
        if(existingToken[1] === true) {
            const updatedToken = await fetch(`https://opentdb.com/api_token.php?command=reset&token=${existingToken[0]}`);
            return true;
        } else {
            const newToken = await fetch("https://opentdb.com/api_token.php?command=request");
            return newToken;
        };
    } catch (error) {
        console.log(error)
    };
};
// https://opentdb.com/api.php?amount=4&category=27&difficulty=easy&type=multiple
async function getQuestions(amountOfQuestions, category, questionsDifficulty, answerType, token) {
    try {
        if(typeof(amountOfQuestions) === "number" && 
        typeof(category) === "number" || "null" || "undefined" && 
        typeof(questionsDifficulty) === "string" || "null" || "undefined" && 
        typeof(answerType) === "string" || "null" || "undefined") {

            const response = `https://opentdb.com/api.php?amount=${amountOfQuestions}` + 
            `${category ? `&category=` + category : ``}` + 
            `${questionsDifficulty ? `&difficulty=` + questionsDifficulty : ``}` + 
            `${answerType ? `&type=` + answerType : ``}` + 
            `${token ? `&token=` + token : ``}`;
            console.log(response);
        } else {
            throw new Error("Wrong type sent")
        };
    } catch (error) {
        console.log(error)
    };
};

async function getCategories() {
    try {
        const categories = await fetch("https://opentdb.com/api_category.php");
        return categories;
    } catch (error) {
        console.log(error)
    };
};

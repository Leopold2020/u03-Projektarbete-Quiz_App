
async function getToken(existingToken) {
    try {
        if(existingToken != null && existingToken.length > 0) {
            await fetch(`https://opentdb.com/api_token.php?command=reset&token=${existingToken[0]}`)
                .then(() => {
                    return true;
                });
        } else {
            const newToken = await fetch("https://opentdb.com/api_token.php?command=request");
            if(!newToken.ok){
                throw new Error("Response did not succeed");
            } else {
                const processedToken = await newToken.json();
                return processedToken.token;
            }
        };
    } catch (error) {
        console.log(error);
    };
};

async function getCategories() {
    try {
        const categories = await fetch("https://opentdb.com/api_category.php");

        if(!categories.ok){
                throw new Error("Response did not succeed");
            } else {
                const processedCategories = await categories.json();
                return processedCategories.trivia_categories;
            }
    } catch (error) {
        console.log(error);
    };
};

async function getQuestions(amountOfQuestions, category, questionsDifficulty, answerType, token) {
    try {
        if(
            (typeof(amountOfQuestions) === "number" || "null" || "undefined") && 
            (typeof(category) === "number" || "null" || "undefined") && 
            (typeof(questionsDifficulty) === "string" || "null" || "undefined") && 
            (typeof(answerType) === "string" || "null" || "undefined")
        ) {
            const questions = await fetch(`https://opentdb.com/api.php?amount=${amountOfQuestions ?? `10`}` + 
            (category ? `&category=` + category : ``) + 
            (questionsDifficulty ? `&difficulty=` + questionsDifficulty : ``) + 
            (answerType ? `&type=` + answerType : ``) + 
            (token ? `&token=` + token : ``));

            if(!questions.ok) {
                throw new Error("Response did not succeed");
            } else {
                const processedQuestions = await questions.json();
                return processedQuestions.results;
            }
            
        } else {
            throw new Error("Wrong type sent");
        };
    } catch (error) {
        console.log(error);
    };
};

// Example for calling functions

// getCategories().then(res => {
//     console.log(res)
// });

// getQuestions().then(res => {
//     console.log(res)
// });

// getToken().then(res => {
//     console.log(res)
// });
const debounce = (func, delay)=>{
    let timeOutId;
    return (...args) => {
        if (timeOutId){
            clearTimeout(timeOutId);
        }
        timeOutId= setTimeout(()=>{
            func.apply(null, args)
        }, delay)
    };
};

//  debounce function is to make input work when user stops for a second so API only runs once , not on every input

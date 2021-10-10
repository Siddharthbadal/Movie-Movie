//  main function working through API
const autoCompleteConfig = {
    // redering image and title
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A'? '': movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
            `;

    },

    // selecting a movie name from dropdown
    inputValue(movie){
        return movie.Title
    },
    // fetching data
    async fetchData(searchTerm) {
        const response = await axios.get("https://www.omdbapi.com/", {
            params: {
                apikey:'*****',
                s: searchTerm
            }
        });
        if(response.data.Error){
            return [];
            }
            return response.data.Search;
        }

};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }, 
    
});
// creating both side html when movie selected
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

//  lef and right are used to compare values
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("https://www.omdbapi.com/", {
        params: {
            apikey:'********',
            i: movie.imdbID
        }
});
    
    summaryElement.innerHTML = movieTemplate(response.data)

    if(side === 'left'){
        leftMovie = response.data;
    } else{
        rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
        runComparison();
    }
};

//  comparing data value fom both sides
const runComparison=()=>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue){    
            leftStat.classList.add('is-warning');
        } else{
            rightStat.classList.add('is-warning');
        }
    }); 

};

//  creating a html template with API values
const movieTemplate = (movieDetail) => {
    //  converting string into int by replacing elements and using ads data-value below
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g, '')
    );
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    console.log(imdbVotes)
    
    // extracting int from text in awards and adding up
    let count = 0
    const awards = movieDetail.Awards.split(' ').reduce((count, word)=>{
        const value = parseInt(word);

        if (isNaN(value)){
            return count;
        } else{
            return count + value
        }
    }, 0);

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
             <img src="${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title} (${movieDetail.Year})</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
     </article>
    
     <article data-value=${awards} class="notification is-dark">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
     </article>
     <article data-value=${dollars} class="notification is-dark">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
     </article>
     <article data-value=${metascore} class="notification is-dark">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
     </article>
     <article data-value=${imdbRating} class="notification is-dark">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
     </article>
     <article data-value=${imdbVotes} class="notification is-dark">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
     </article>
          
     <article class="notification is-dark is-danger">
        <p class="title">${movieDetail.Runtime}</p>
        <p class="subtitle">Runtime</p>
     </article>
     <article class="notification is-dark is-danger">
        <p class="title">${movieDetail.Director}</p>
        <p class="subtitle">Director</p>
     </article>
     <article class="notification is-dark is-danger">
        <p class="title">${movieDetail.Actors}</p>
        <p class="subtitle">Actors</p>
     </article>     
    `;
}

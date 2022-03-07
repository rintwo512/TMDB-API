
const cariBtn = document.querySelector('.search-button');

cariBtn.addEventListener('click', async function() {

    try{
        const inputKeyword = document.querySelector('.input-keyword');    
        const movies = await getMovies(inputKeyword.value);    
        updateUi(movies);
    }catch(gagal){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
    }
});

function getMovies(keyword){
    return fetch(`https://api.themoviedb.org/3/search/movie?api_key=b3a05b151faf03f5a69edde6e994354f&language=en-US&query=${keyword}&page=1&include_adult=false`)
        .then(response => {
            if(!response.ok){
                throw new Error(response.statusText);
            }else{
                return response.json();
            }
            // console.log(response);
        })
        .then(response => {
            if(response.Response === "False"){
                throw new Error(response.Error);
            }else{
                return response.results;
            }
        });
};

function updateUi(movies) {
    let urlImg = 'https://image.tmdb.org/t/p/w500';
    let cards = '';
    movies.forEach(mv => cards += showCard(mv, urlImg));
    const mvContainer = document.querySelector('.movie-container');
    mvContainer.innerHTML = cards;    
            
};


// detail film menggunakan event binding
document.addEventListener('click', async function (e) {
    if(e.target.classList.contains('modal-detail-btn')){
        const imdbid = e.target.dataset.imdbid;        
        const mDetail = await getMovieDetail(imdbid);
        const mDetail2 = await getMovieDetail2(imdbid);
        updateUiMovieDetail(mDetail, mDetail2);
    }
});

function getMovieDetail(idMovie){
    return fetch(`https://api.themoviedb.org/3/movie/${idMovie}/videos?api_key=b3a05b151faf03f5a69edde6e994354f&language=en-US`)
        .then(response => response.json())
        .then(response => response.results[0]);        
}

function getMovieDetail2(idMovie2){
    return fetch(`https://api.themoviedb.org/3/movie/${idMovie2}?api_key=b3a05b151faf03f5a69edde6e994354f&language=en-US`)
    .then(response => response.json())
    .then(response => response);
}

function updateUiMovieDetail(c, d){     
    const movieDetail = showMovieDetail(c, d);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
    const modalTitle = document.querySelector('.modal-title');    
    modalTitle.innerHTML = `${c.name}`;    
}


function showCard(mv, urlImg){
    return `<div class="col-md-auto mb-3"><div class="card" style="width: 18rem;">
    <img src="${urlImg}${mv.poster_path}" class="card-img-top" alt="${mv.title}">
    <div class="card-body">
      <h5 class="card-title text-muted">${mv.title}</h5>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Release Date : </strong>${mv.release_date}</li>                
      </ul>      
      <a href="#" class="btn btn-primary modal-detail-btn mt-3" data-toggle="modal" data-target="#exampleModal" data-imdbid="${mv.id}">Trailer</a>
    </div>
</div></div>`;
}


function showMovieDetail(c, d){
    
    return `<div class="embed-responsive embed-responsive-16by9 mb-3">       
    <iframe src="https://www.youtube.com/embed/${c.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div><ul class="list-unstyled"><li class="media">  
  <div class="media-body">
    <h5 class="mt-0 mb-1">Overview</h5>
    ${d.overview}
  </div>
</li></ul>`;
}
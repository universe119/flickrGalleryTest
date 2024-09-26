let dataType = "";
const [btnMine, btnPopular] = document.querySelectorAll("nav button");
//searchBox안쪽에 있는 두번째 요소인 input, 세번째 요소인 btnSearch를 비구조할당으로 변수할당
const [_, inputSearch, btnSearch] =
	document.querySelector(".searchBox").children;
// console.log(btnSearch); // input확인

//fetch 함수 호출시 인수값을 객체 형태로 전달
//이유: search, user타입 갤러리는 타입외에도 유저명, 검색어등의 추가 정보값을 제공해야 되기 때문
fetchFlickr({ type: "mine" });

//각 버튼 클릭시 갤러리 타입 변경
btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));
//검색버튼 클릭시
btnSearch.addEventListener("click", () => {
	//인풋요소의 value값 (검색어)을 tags에 담아 fetchFlickr함수 호출
	fetchFlickr({ type: "search", tags: inputSearch.value });
	//호출시 input요소의 검색어는 지워줌
	inputSearch.value = "";
});
//특정 요소에 특정 함수 연결
document.body.addEventListener("click", (e) => {
	if (e.target.className === "thumb") createModal(e);
	if (e.target.className === "btnClose") removeModal();
	//목록에서 사용자 프로필 아이디 클릭시 클릭한 span요소의 사용자 아이디 텍스트값을 fetchFlickr의 인수로 전달해 호출
	if (e.target.className === "userID")
		fetchFlickr({ type: "user", userID: e.target.innerText }); //user타입 갤러리에는 userID라는 추가 프로퍼티로 유저아이디 값을 전달
});

function fetchFlickr(opt) {
	// 타입이 opt라는 파라미터 객체안쪽에 들어가 있기 때문에
	if (opt.type === dataType) return;
	dataType = opt.type;

	const api_key = "21e294ad0ec03a32d7355980457d9e11";
	const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
	const myID = "197119297@N02";
	const method_mine = "flickr.people.getPhotos";
	const method_interest = "flickr.interestingness.getList";
	// 검색전용 api메서드 추가
	const method_search = "flickr.photos.search";
	let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
	let url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&nojsoncallback=1&format=json`;
	let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;
	//opt로 전달된 tags 프로퍼티의 값을 tags라는 쿼리값 연동
	let url_search = `${baseURL}${method_search}&tags=${opt.tags}&nojsoncallback=1&format=json`;
	let result_url = "";

	if (opt.type === "mine") result_url = url_mine;
	if (opt.type === "interest") result_url = url_interest;
	if (opt.type === "user") result_url = url_user;
	// 전달된 opt.type값이 search이면 url_search 요청을 fetch함수에 전달
	if (opt.type === "search") result_url = url_search;

	fetch(result_url)
		.then((data) => data.json())
		.then((json) => {
			const picArr = json.photos.photo;
			createList(picArr);
		});
}
//body요소에 클릭했을때 클릭한요소의 클래스명을 구분자로 설정
//특정 요소에 특정 함수 연결
document.body.addEventListener("click", (e) => {
	if (e.target.className === "thumb") createModal(e);
	if (e.target.className === "btnClose") removeModal();
	if (e.target.className === "userID") fetchFlickr(e.target.innerText);
});

//이미지 엑박시 대체이미지 연결 함수
function setDefImg() {
	const profilePic = document.querySelectorAll(".profile img"); //algarve sunset long exposure요 이미지가 엑박이므로 수정한거,
	console.log(profilePic);
	profilePic.forEach(
		(imgEl) =>
			(imgEl.onerror = () =>
				imgEl.setAttribute(
					"src",
					"https://www.flickr.com/images/buddyicon.gif"
				))
	);
}

//모달생성 함수
function createModal(e) {
	const imgSrc = e.target.getAttribute("alt");

	const modal = document.createElement("aside");
	modal.classList.add("modal");
	modal.innerHTML = `
      <div class='con'>
        <img src=${imgSrc} />
      </div>
      <button class='btnClose'>CLOSE</button>
    `;

	document.body.append(modal);
}

//모달 제거함수
function removeModal() {
	document.querySelector(".modal").remove();
}

//목록 생성 함수
function createList(dataArr) {
	const list = document.querySelector(".list");
	let tags = "";

	dataArr.forEach((pic) => {
		tags += `
    <li>
      <figure class="pic">
      <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
      </figure>
      <h2>${pic.title}</h2>

      <div class="profile">
        <img src="http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg" alt=${pic.owner} />
        <span class='userID'>${pic.owner}</span>
      </div>
    </li>
    `;
	});

	list.innerHTML = tags;

	setDefImg();
}

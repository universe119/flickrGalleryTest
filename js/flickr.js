const [btnMine, btnPopular] = document.querySelectorAll("nav button");

//스크립트 처음 로드시에는 내갤러리 출력
fetchFlickr("mine");

//각 버튼 클릭시 갤러리 타입 변경
btnMine.addEventListener("click", () => fetchFlickr("mine"));
btnPopular.addEventListener("click", () => fetchFlickr("interest"));

//특정 요소에 특정 함수 연결
document.body.addEventListener("click", (e) => {
	if (e.target.className === "thumb") createModal(e);
	if (e.target.className === "btnClose") removeModal();
});

//flickr fetching함수
function fetchFlickr(type) {
	const api_key = "21e294ad0ec03a32d7355980457d9e11";
	const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
	const myID = "197119297@N02";
	const method_mine = "flickr.people.getPhotos";

	const method_interest = "flickr.interestingness.getList";

	let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
	let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;

	let result_url = type === "mine" ? url_mine : url_interest;

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
});

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
        <span>${pic.owner}</span>
      </div>
    </li>
    `;
	});

	list.innerHTML = tags;

	const profilePic = document.querySelectorAll(".profile img");
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
//

//미션
//- createList()라는 함수를 생성
//- fetchFlickr 함수에서 동적 리스트 생성하는 코드를 createList함수로 분리
//- 인수로 데이터 배열을 전달받아 목록 ㅜㄹ력
//- 9시 25분까지

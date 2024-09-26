const [btnMine, btnPopular] = document.querySelectorAll("nav button");
let dataType = "";

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
	//인수로 전달된 type정보와 현재 출력되고 있는 dataType이 동일하면
	// 다시 data fetching할 필요가 없으므로 return으로 강제 함수 종료
	// 만약 타입이 다르면 해당 if문 무시
	if (type === dataType) return;
	//인수로 전달된 타입명으로 현재 dataType을 변경
	dataType = type;

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
        <span>${pic.owner}</span>
      </div>
    </li>
    `;
	});

	list.innerHTML = tags;

	setDefImg();
}
//미션
//createList 안쪽에서 프로필 이미지 엑박시 대체이미지 바꿔치기 하는 기능을 또다른 함수로 분리
//setDefaultImage() - 9시 40분까지 고민

// 개발자모드에서 네트워크 보면 My Gallery를 클릭시 똑같은 데이터가 한번 더 받아지는게 보이는데 이걸 어찌 해결해야할지 생각해보기

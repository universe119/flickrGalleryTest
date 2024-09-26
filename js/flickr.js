const api_key = "21e294ad0ec03a32d7355980457d9e11";
const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
const myID = "197119297@N02";
const method_mine = "flickr.people.getPhotos";
let url = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
// 기본요청URL에 쿼리값 제대로 넣어서 fetch처리했을때
// 콘솔문에 not valid json 오류뜨는 경우
// 원인 : json데이터가 callback함수안에 들어가 있는 경우
// 해결방법 : format=json&nojsoncallback=1 (callback 안쪽의 json데이터를 직접 가져옴)
// 2시 5분까지 위의 방법으로 데이터가 잘 불러와지는지 테스트
const list = document.querySelector(".list");

fetch(url)
	.then((data) => data.json())
	.then((json) => {
		console.log(json.photos.photo);
		const picArr = json.photos.photo;
		let tags = "";
		picArr.forEach((pic) => {
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
	});

//미션1 - 현재 img.thumb을 클릭시 레이어모달이 생성됨 처리
//미션2 - 동적으로 생성된 레이어팝업의 닫기버튼 클릭시 레이어모달 제거
//미션3 - img.thumb의 alt속성에 숨겨놓은 큰해상도의 이미지 url을 레이어모달 안에 출력
document.body.addEventListener("click", (e) => {
	if (e.target.className === "thumb") {
		console.log(e.target);
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
});
document.body.addEventListener("click", (e) => {
	if (e.target.className === "btnClose") {
		document.querySelector(".modal").remove();
	}
});

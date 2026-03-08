const loadModal=async(id)=>{
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayModal(details.data);
}

const displayModal = (modal)=>{
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML=`
                <div class="space-y-2">
                    <h2 class="text-[18px] font-bold">${modal.title}</h2>
                    <p class="text-[14px]"> <span class="px-2 py-1 rounded text-white ${
        modal.status === 'open' ? 'bg-green-500' : 'bg-red-500'}">
        ${modal.status}</span> . ${modal.status} by ${modal.author} . ${modal.createdAt.split('T')[0]}</p>
                </div>
                <div class="my-5">
                        ${createElements(modal.labels)}
                </div>
                <div>
                    <p class="text-[14px]">${modal.description}</p>
                </div>
                <div class="flex justify-around items-center">
                    <div>
                        <p class="text-[14px]">Assignee :</p>
                        <h2 class="font-bold">${modal.author}</h2>
                    </div>
                    <div>
                        <p>Priority :</p>
                        <p  class="px-2 py-1 rounded text-white text-xs ${
                        modal.priority === 'high' 
                        ? 'bg-red-500' 
                        : modal.priority === 'medium' 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-500'
                    }">${modal.priority}</p>
                    </div>
                </div>
    `;
    document.getElementById('my_modal_5').showModal();
}
const createElements=(arr)=>{
    const htmlElements=arr.map((el)=>`<span class="btn">${el}</span>`);
    return(htmlElements.join(" "));
}

const manageSpinner = (status)=>{
    if(status==true){
        const spin = document.getElementById('spinner');
        spin.classList.remove('hidden');
        spin.classList.add('flex');
        document.getElementById('open-closed').classList.add('hidden');
        document.getElementById('card-container').classList.add('hidden');
    }else{
        const spin = document.getElementById('spinner');
        spin.classList.add('hidden');
        spin.classList.remove('flex');
        document.getElementById('open-closed').classList.remove('hidden');
        document.getElementById('card-container').classList.remove('hidden');
    }
}


let allIssues = [];

const loadIssues = () => {
    manageSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;  
            displayIssues(allIssues);
        }); 
};

const displayIssues=(issues)=>{
    const cardContainer =document.getElementById('card-container');
    const issueCount =document.getElementById('issue-count');
    cardContainer.innerHTML='';

    for(let issue of issues){
        const cardDiv=document.createElement('div');
        cardDiv.innerHTML=`
         <div onclick="loadModal(${issue.id})" class="card bg-white rounded-xl p-5 space-y-3 h-full border-t-4 ${issue.status==='open' ? 'border-green-500' : 'border-purple-500'}">
                <div class="flex justify-between">
                    <img src="${issue.status=='open' ? './B13-A5-Github-Issue-Tracker/assets/Open-Status.png' : './B13-A5-Github-Issue-Tracker/assets/Closed- Status .png'}" alt="">
                    <p class="px-2 py-1 rounded text-white text-xs ${
                        issue.priority === 'high' 
                        ? 'bg-red-500' 
                        : issue.priority === 'medium' 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-500'
                    }">
                        ${issue.priority}
                    </p>
                </div>
                <div>
                    <h2 class="text-[18px] font-bold">${issue.title}</h2>
                    <p class="text-[12px]">${issue.description}</p>
                </div>
                <div>${createElements(issue.labels)}</div><hr>
                <div>
                    <h2 class="font-bold text-[14px]">#${issue.id} by ${issue.author}</h2>
                    <p class="text-[12px]">${issue.createdAt.split('T')[0]}</p>
                </div>
            </div>
        `
        cardContainer.append(cardDiv);
        
        issueCount.innerText=cardContainer.children.length;
    }
    manageSpinner(false);
}

const showSearch = () => {
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();

    if(searchValue === ""){
        displayIssues(allIssues);
        return;
    }

    const filteredIssues = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(searchValue)
    );

    displayIssues(filteredIssues);
}

loadIssues();

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");

const buttons =[allBtn,openBtn,closedBtn];

const activeButton=(active)=>{
    buttons.forEach(btn=>{
        if(btn===active){
            btn.classList.add('btn-primary');
        }else{
            btn.classList.remove('btn-primary');
        }
    })
}

allBtn.addEventListener("click", () => {
    displayIssues(allIssues);
    activeButton(allBtn);
});

openBtn.addEventListener("click", () => {
    const openIssues = allIssues.filter(issue => issue.status === "open");
    displayIssues(openIssues);
    activeButton(openBtn);
});

closedBtn.addEventListener("click", () => {
    const closedIssues = allIssues.filter(issue => issue.status === "closed");
    displayIssues(closedIssues);
    activeButton(closedBtn);
});
document.getElementById('sign-in').addEventListener('click',()=>{
    const userName = document.getElementById('username');
    const user = userName.value;

    const passWord = document.getElementById('password');
    const pass = passWord.value;

    if(user === 'admin' && pass === 'admin123'){
        window.location.assign('./home.html');
    }
    else{
        document.getElementById('my_modal_5').showModal();
        return;
    }
})
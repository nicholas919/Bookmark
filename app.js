document.body.addEventListener('click', function(){
    [document.querySelector('#user-info')].forEach(item => {
        if(item){
            item.remove();
        }
    })
})

const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const setupUI = (user) => {   
    if(user){
        if(user.emailVerified){
            document.body.style.setProperty('background-color', '#eeeeee', 'important');
            document.querySelector('#form-masuk').remove();
            user.getIdTokenResult().then(idTokenResult => {
                if(idTokenResult.claims.moderator || idTokenResult.claims.adminKantor || idTokenResult.claims.member){
                    document.querySelector('#navbar').style.display = 'grid';
                    document.querySelector('#kalender').style.setProperty('display', 'grid', 'important');
                    document.querySelector('#nav-sidebar').style.display = 'block';
                    document.querySelector('#myTabContent').style.display = 'block';
                    document.querySelector('#user').addEventListener('click', function(e){
                        e.stopImmediatePropagation();
                        if(!document.querySelector('#user-info')){
                            let userInfo = document.createElement('div');
                            userInfo.setAttribute('id', 'user-info');
                            userInfo.classList.add('rounded');
                            userInfo.innerHTML = `
                            <i class='fas fa-user-circle rounded-circle user'></i>
                            <div id="nama-user">${auth.currentUser.displayName}</div>
                            <div id="email-user">${auth.currentUser.email}</div>
                            <div style="display:grid;">
                                <div class="btn btn-light" id="manage-account">Manage your account</div>
                                <div class="btn btn-light" id="log-out">Log out from account</div>
                            </div>
                            `;
                            document.body.appendChild(userInfo);

                            document.querySelector('#log-out').addEventListener('click', function(e){
                                e.stopPropagation();
                                auth.signOut();
                            })
                        } else {
                            document.querySelector('#user-info').remove();
                        }
                    })

                    if(window.innerWidth < 1300){
                        for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
                            document.querySelectorAll('.bulan-kalender')[y].innerHTML = document.querySelectorAll('.bulan-kalender')[y].innerHTML.slice(0,3);
                        }                       
                        if(window.innerWidth < 800){
                            document.querySelector('#kalender').style.setProperty('display', 'block', 'important')
                        }
                    } else if(window.innerWidth > 1300){
                        for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
                            document.querySelectorAll('.bulan-kalender')[y].innerHTML = bulan[y];
                        }                       
                    }

                    window.addEventListener('resize', windowResize)


                }


                [document.querySelector('#undur-tahun-kalender'), document.querySelector('#maju-tahun-kalender')].forEach(item => {
                    item.addEventListener('click', function(){
                        if(item == document.querySelector('#undur-tahun-kalender')){
                            document.querySelector('#tahun-kalender-sekarang').innerHTML = Number(document.querySelector('#tahun-kalender-sekarang').innerHTML) - 1;
                        } else if(item == document.querySelector('#maju-tahun-kalender')){
                            document.querySelector('#tahun-kalender-sekarang').innerHTML = Number(document.querySelector('#tahun-kalender-sekarang').innerHTML) + 1;
                        }
                        if(document.querySelector('[current-date]')){
                            return renderKalender(Number(document.querySelector('#tahun-kalender-sekarang').innerHTML), Number(document.querySelector('[selected-month]').getAttribute('data-value')), Number(document.querySelector('[current-date]').innerHTML));
                        }
                    })
                })      

                for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
                    document.querySelectorAll('.bulan-kalender')[y].addEventListener('click', function(){                       
                        if(document.querySelector('[current-date]')){
                            return renderKalender(Number(document.querySelector('#tahun-kalender-sekarang').innerHTML), Number(this.getAttribute('data-value')), Number(document.querySelector('[current-date').innerHTML));
                        }
                    })
                }

                renderKalender(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

                function renderKalender(YYYY,MM,DD){
                    for(let y = document.querySelectorAll('.minggu-kalender').length; y>= 0; y--){
                        if(document.querySelectorAll('.minggu-kalender')[y]){
                            document.querySelectorAll('.minggu-kalender')[y].remove();
                        }
                    }
                    for(let y = 0; y<document.querySelectorAll('.tanggal-kalender').length; y++){
                        if(document.querySelectorAll('.tanggal-kalender')[y].classList.contains('tanggal-kalender-bulan-sebelum')){
                            document.querySelectorAll('.tanggal-kalender')[y].classList.remove('tanggal-kalender-bulan-sebelum');
                        } else if(document.querySelectorAll('.tanggal-kalender')[y].classList.contains('tanggal-kalender-bulan-setelah')){
                            document.querySelectorAll('.tanggal-kalender')[y].classList.remove('tanggal-kalender-bulan-setelah');
                        }
                    }

                    document.querySelector('#tahun-kalender-sekarang').innerHTML = YYYY;
                    let tanggalSekarang = DD;
                    let bulanSekarang = MM;
                    let tahunSekarang = YYYY;
                    if(tanggalSekarang > new Date(tahunSekarang, bulanSekarang + 1, 0).getDate()){
                        tanggalSekarang = new Date(tahunSekarang, bulanSekarang + 1, 0).getDate();
                    }
                    let hariSekarang = new Date(tahunSekarang, bulanSekarang, tanggalSekarang).getDay();
                    let bulanSebelum = bulanSekarang - 1;
                    let tahunSebelum = new Date(tahunSekarang, bulanSebelum).getFullYear();
                    bulanSebelum = new Date(tahunSekarang, bulanSebelum).getMonth();
                    let bulanSetelah = bulanSekarang + 1;
                    let tahunSetelah = new Date(tahunSekarang, bulanSetelah).getFullYear();
                    bulanSetelah = new Date(tahunSekarang, bulanSetelah).getMonth();
                    let jumlahTanggalBulanSebelum = new Date(tahunSekarang, bulanSekarang, 0).getDate();
                    let jumlahTanggalBulanIni = new Date(tahunSekarang, bulanSekarang + 1, 0).getDate();
                    let hariTanggalAwalBulan = new Date(tahunSekarang, bulanSekarang, 1).getDay();
                    let hariTanggalAkhirBulan = new Date(tahunSekarang, bulanSekarang + 1, 0).getDay();
                    let jumlahMinggu = Math.ceil((jumlahTanggalBulanIni + hariTanggalAwalBulan + (6- hariTanggalAkhirBulan))/7);

                    for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
                        if(document.querySelectorAll('.bulan-kalender')[y].getAttribute('data-value') == bulanSekarang){
                            document.querySelectorAll('.bulan-kalender')[y].setAttribute('selected-month', '');
                        } else {
                            document.querySelectorAll('.bulan-kalender')[y].removeAttribute('selected-month');
                        }
                    }

                    let x = 0;
                    while(x<jumlahMinggu){
                        let minggu = document.createElement('div');
                        minggu.setAttribute('id', 'minggu' + (x + 1));
                        minggu.classList.add('minggu-kalender')
                        minggu.innerHTML = `
                        <div class="minggu">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="senin">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="selasa">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="rabu">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="kamis">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="jumat">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        <div class="sabtu">
                            <div class="tanggal-kalender"></div>
                            <div class="bulletin-activities"></div>
                        </div>
                        `
                        document.querySelector('#tanggal-kalender').appendChild(minggu);
                        x++
                    }

                    for(let y = hariTanggalAwalBulan - 1; y>=0; y--){
                        document.querySelectorAll('.tanggal-kalender')[y].style.padding = '6px';
                        document.querySelectorAll('.tanggal-kalender')[y].classList.add('tanggal-kalender-bulan-sebelum');
                        document.querySelectorAll('.tanggal-kalender')[y].setAttribute('id', tahunSebelum + '-' + ("0" + (bulanSebelum + 1)).slice(-2) + '-' + ("0" + jumlahTanggalBulanSebelum).slice(-2));
                        document.querySelectorAll('.tanggal-kalender')[y].innerHTML = jumlahTanggalBulanSebelum;
                        jumlahTanggalBulanSebelum--;
                    }

                    let hariAwal = 1;
                    for(let y = hariTanggalAwalBulan; y<jumlahTanggalBulanIni + hariTanggalAwalBulan; y++){
                        if(hariAwal < 10){
                            document.querySelectorAll('.tanggal-kalender')[y].style.padding = '6px 10px';
                        } else {
                            document.querySelectorAll('.tanggal-kalender')[y].style.padding = '6px';
                        }
                        document.querySelectorAll('.tanggal-kalender')[y].setAttribute('id', tahunSekarang + '-' + ("0" + (bulanSekarang + 1)).slice(-2) + '-' + ("0" + hariAwal).slice(-2));
                        document.querySelectorAll('.tanggal-kalender')[y].innerHTML = hariAwal;
                        hariAwal++;
                    }

                    let hariAkhir = 1;
                    for(let y = hariTanggalAwalBulan + jumlahTanggalBulanIni; y<hariTanggalAwalBulan + jumlahTanggalBulanIni + (6 - hariTanggalAkhirBulan);y++){
                        document.querySelectorAll('.tanggal-kalender')[y].style.padding = '6px 10px';
                        document.querySelectorAll('.tanggal-kalender')[y].classList.add('tanggal-kalender-bulan-setelah');
                        document.querySelectorAll('.tanggal-kalender')[y].setAttribute('id', tahunSetelah + '-' + ("0" + (bulanSetelah + 1)).slice(-2) + '-' + ("0" + hariAkhir).slice(-2));
                        document.querySelectorAll('.tanggal-kalender')[y].innerHTML = hariAkhir;
                        hariAkhir++;
                    }

                    document.querySelector('#tanggal-sekarang').innerHTML = tanggalSekarang; 
                    document.querySelector('#hari-sekarang').innerHTML = hari[hariSekarang].toUpperCase();
                    for(let y = 0; y<document.querySelectorAll('.tanggal-kalender').length; y++){
                        if(document.querySelectorAll('.tanggal-kalender')[y].getAttribute('id') == tahunSekarang + '-' + ("0" + (bulanSekarang + 1)).slice(-2) + '-' + ("0" + tanggalSekarang).slice(-2)){
                            document.querySelectorAll('.tanggal-kalender')[y].setAttribute('current-date', '');
                            for(let z = 0; z<document.querySelectorAll('.aktivitas-kalender-onlist').length; z++){
                                if(document.querySelectorAll('.aktivitas-kalender-onlist')[z].getAttribute('data-date') == document.querySelectorAll('.tanggal-kalender')[y].getAttribute('id')){
                                    document.querySelectorAll('.aktivitas-kalender-onlist')[z].removeAttribute('noncurrent-event');
                                    document.querySelectorAll('.aktivitas-kalender-onlist')[z].setAttribute('current-event', '');
                                } else {
                                    document.querySelectorAll('.aktivitas-kalender-onlist')[z].removeAttribute('current-event');
                                    document.querySelectorAll('.aktivitas-kalender-onlist')[z].setAttribute('noncurrent-event', '');                                    
                                }
                            }                           
                        }

                        document.querySelectorAll('.tanggal-kalender')[y].addEventListener('click', function(e){
                            if(document.querySelector('[current-date]')){
                                document.querySelector('[current-date]').removeAttribute('current-date')
                            }
                            this.setAttribute('current-date', '');
                            renderKalender(Number(this.getAttribute('id').slice(0,4)), Number(this.getAttribute('id').slice(5,7)) - 1, Number(this.getAttribute('id').slice(8, 10)));
                        })
                    }
                    
                }

                if(idTokenResult.claims.moderator){
                    
                } else if(idTokenResult.claims.adminKantor){

                } else if(idTokenResult.claims.member){

                } else {
                    let reqCustomClaims = document.createElement('div');
                    reqCustomClaims.setAttribute('id', 'req-custom-claims');
                    reqCustomClaims.innerHTML = `
                    <i class="material-icons" id="servicestack">nature_people</i>
                    <div>Looks like you haven't had access to the website.</div>
                    <div>You may need contact and send request to Administrator in order to access this website.</div>
                    <div id="send-req-custom-claims" class="rounded">Send Request</div>
                    `;
                    document.body.appendChild(reqCustomClaims)

                    document.querySelector('#send-req-custom-claims').addEventListener('click', function(e){
                        e.stopPropagation();
                        db.collection('user').doc(auth.currentUser.uid).set({
                            username : auth.currentUser.displayName,
                            email : auth.currentUser.email,
                            userId : auth.currentUser.uid
                        }).then(() => {
                            alert('Your request has been sended!');
                        })          
                    })
                }
            })
        } else {
            let notification = document.createElement('div');
            notification.setAttribute('id', 'notify-verify-email');
            notification.innerHTML = `
            <div id="label-verify-email">Please verify your email</div>
            <div style="margin-bottom:15px;">You're almost there! We sent an email to <span style="font-weight:bold;">${auth.currentUser.email}</span></div>
            <div style="font-size:14px;">Just click on the link in that email to complete your signup.</div>
            <div style="font-size:14px;">If you don't see it, you may need to <span style="font-weight:bold">check your spam</span> folder.</div>
            `;
            document.querySelector('#ikon-bookmark').parentElement.insertBefore(notification, document.querySelector('#ikon-bookmark').nextSibling);
            document.querySelector('#email-login').parentElement.remove();
            document.querySelector('#password-login').parentElement.remove();
            document.querySelector('#lupa-password').parentElement.remove();
            [document.querySelector('#form-daftar'), document.querySelector('#form-masuk')].forEach(item => {
                if(item){
                    if(item == document.querySelector('#form-daftar')){
                        item.removeEventListener('submit', formDaftar);
                        document.querySelector('#sign-in').parentElement.remove();
                        document.querySelector('#nama-login').parentElement.remove();
                    } else if(item == document.querySelector('#form-masuk')){
                        item.removeEventListener('submit', formMasuk);
                        document.querySelector('#sign-up').parentElement.remove();
                    }
                    item.style.display = 'block';
                    item.querySelector('button[type=submit]').innerHTML = 'Resend email';
                    item.setAttribute('id', 'form-verify-email');
                    item.addEventListener('submit', resendEmailVerification);
                }
            })
            let emailVerified = setInterval(verifyEmail,1000)
            function verifyEmail(){
                auth.currentUser.reload();
                if(auth.currentUser.emailVerified){
                    clearInterval(emailVerified)
                    alert('Your email addresses has been verified! log in again to access this website');
                    auth.signOut().then(() =>{
                        window.location.reload();
                    })
                }
            }           
        }
    } else {
        window.removeEventListener('resize', windowResize);
        if(document.querySelector('#user-info')){
            document.querySelector('#user-info').remove();
        }   
        document.querySelector('#navbar').style.display = 'none';
        document.querySelector('#nav-sidebar').style.display = 'none';
        document.querySelector('#myTabContent').style.display = 'none';
        document.body.style.setProperty('background-color', '#4793d1', 'important')     
        if(!document.querySelector('#form-masuk')){
            let form = document.createElement('form');
            form.setAttribute('id', 'form-masuk');
            form.classList.add('need-validation', 'bg-white', 'rounded');
            form.setAttribute('novalidate', '');
            form.innerHTML = `
            <div style="padding: 60px 20px 20px;">
                <img src="bookmark-alt-flat.png" class="rounded-circle" id="ikon-bookmark">
                <div class="form-group">
                    <input type="email" class="form-control rounded-0" id="email-login" placeholder="Enter email" style="box-shadow:none;" required>
                    <div class="valid-tooltip">
                        Looks good!
                    </div>
                    <div class="invalid-tooltip">
                        Please provide a valid email 
                    </div>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control rounded-0" id="password-login" placeholder="Enter password" style="box-shadow:none;" required>
                    <div class="valid-tooltip">
                        Looks good!
                    </div>
                    <div class="invalid-tooltip">
                        Please provide a required password for email
                    </div>
                </div>
                <button id="submit-login" type="submit" class="btn d-block w-100 rounded-0">Sign in</button>
                <div style="display: flex;"><div>Don't have an account?</div><div style="color:dodgerblue;margin-left:3px;cursor: pointer;" id="sign-up">Sign up</div></div>
                </div>
            <div class="rounded-bottom" id="parent-lupa-password"><div id="lupa-password">Forgot password?</div></div>
            `
            document.body.appendChild(form);
            document.querySelector('#form-masuk').style.display = 'block';

            document.querySelector('#form-masuk').addEventListener('submit', formMasuk);
            document.querySelector('#lupa-password').addEventListener('click', lupaPassword);

        } else {
            document.querySelector('#form-masuk').style.display = 'block';
        }
        [document.querySelector('#sign-in'), document.querySelector('#sign-up')].forEach(item => {
            if(item){
                item.addEventListener('click', loginAct);
            }
        });
    }
};


function windowResize(){
    if(window.innerWidth < 1300){
        for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
            document.querySelectorAll('.bulan-kalender')[y].innerHTML = document.querySelectorAll('.bulan-kalender')[y].innerHTML.slice(0,3);
        }                           
        if(window.innerWidth < 800){
            document.querySelector('#kalender').style.setProperty('display', 'block', 'important')
        } else {
            document.querySelector('#kalender').style.setProperty('display', 'grid', 'important')
        }       
    } else if(window.innerWidth > 1300){
        for(let y = 0; y<document.querySelectorAll('.bulan-kalender').length; y++){
            document.querySelectorAll('.bulan-kalender')[y].innerHTML = bulan[y];
        }                           
    }
}


document.querySelector('#lupa-password').addEventListener('click', lupaPassword)

function lupaPassword(e){
    document.querySelector('#password-login').parentElement.remove();
    let labelForgotPassword = document.createElement('div');
    labelForgotPassword.setAttribute('id', 'label-forgot-password')
    labelForgotPassword.innerHTML = 'Forgot Password';
    document.querySelector('#email-login').parentElement.parentElement.insertBefore(labelForgotPassword, document.querySelector('#email-login').parentElement)
    document.querySelector('#email-login').setAttribute('placeholder', 'Your email address')
    if(e.target.parentElement.parentElement == document.querySelector('#form-masuk')){
        document.querySelector('#sign-up').previousElementSibling.innerHTML = 'Just remembered?'
        document.querySelector('#sign-up').innerHTML = "Sign in"
        document.querySelector('#sign-up').id = "sign-in"
    } else if(e.target.parentElement.parentElement == document.querySelector('#form-daftar')){
        document.querySelector('#nama-login').parentElement.remove();
        document.querySelector('#sign-in').previousElementSibling.innerHTML = 'Just remembered?'        
    }
    e.target.parentElement.parentElement.setAttribute('id', 'form-reset');
    e.target.parentElement.parentElement.querySelector('button[type=submit]').innerHTML = 'Reset my password';
    e.target.parentElement.parentElement.addEventListener('submit', formReset);
    e.target.parentElement.parentElement.removeEventListener('submit', formDaftar);
    e.target.parentElement.parentElement.removeEventListener('submit', formMasuk);  
    e.target.parentElement.remove();
}


function loginAct(e){
    if(e.target.parentElement.parentElement.parentElement.getAttribute('id') == 'form-masuk'){
        e.target.parentElement.parentElement.parentElement.setAttribute('id', 'form-daftar');
        let formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        formGroup.innerHTML = `
        <input type="text" class="form-control rounded-0" id="nama-login" placeholder="Enter name" style="box-shadow:none;" required>
        <div class="valid-tooltip">
            Looks good!
        </div>
        <div class="invalid-tooltip">
            Please provide a valid name 
        </div>
        `
        document.querySelector('#email-login').parentElement.parentElement.insertBefore(formGroup, document.querySelector('#email-login').parentElement);
        e.target.setAttribute('id', 'sign-in');
        e.target.innerHTML = 'Sign In';
        e.target.previousElementSibling.innerHTML = 'Already have an account?';
        e.target.parentElement.parentElement.parentElement.querySelector('button[type=submit]').innerHTML = 'Sign up';
        e.target.parentElement.parentElement.parentElement.addEventListener('submit', formDaftar);
        e.target.parentElement.parentElement.parentElement.removeEventListener('submit', formReset);
        e.target.parentElement.parentElement.parentElement.removeEventListener('submit', formMasuk);
    } else if(e.target.parentElement.parentElement.parentElement.getAttribute('id') == 'form-daftar' || e.target.parentElement.parentElement.parentElement.getAttribute('id') == 'form-reset'){
        e.target.parentElement.parentElement.parentElement.setAttribute('id', 'form-masuk');
        if(!document.querySelector('#email-login')){
            let formGroup = document.createElement('div');
            formGroup.classList.add('form-group');
            formGroup.innerHTML = `
            <input type="email" class="form-control rounded-0" id="email-login" placeholder="Enter email" style="box-shadow:none;" required>
            <div class="valid-tooltip">
                Looks good!
            </div>
            <div class="invalid-tooltip">
                Please provide a required password for email 
            </div>          
            `
            e.target.parentElement.parentElement.insertBefore(formGroup, e.target.parentElement)
        }
        if(!document.querySelector('#password-login')){
            let formGroup = document.createElement('div');
            formGroup.classList.add('form-group');
            formGroup.innerHTML = `
            <input type="password" class="form-control rounded-0" id="password-login" placeholder="Enter password" style="box-shadow:none;" required>
            <div class="valid-tooltip">
                Looks good!
                </div>
            <div class="invalid-tooltip">
                Please provide a required password for email 
            </div>
            `
            document.querySelector('#email-login').parentElement.parentElement.insertBefore(formGroup, document.querySelector('#email-login').parentElement.nextSibling);                   
        }
        if(!e.target.parentElement.parentElement.parentElement.querySelector('button[type=submit]')){
            let buttonSubmit = document.createElement('button');
            buttonSubmit.setAttribute('type', 'submit');
            buttonSubmit.setAttribute('id', 'submit-login')
            buttonSubmit.classList.add('btn', 'd-block', 'w-100', 'rounded-0');
            buttonSubmit.innerHTML = 'Sign in';
            document.querySelector('#password-login').parentElement.parentElement.insertBefore(buttonSubmit, document.querySelector('#password-login').parentElement.nextSibling);
        }
        if(document.querySelector('#label-forgot-password')){
            document.querySelector('#label-forgot-password').remove();
        }
        if(document.querySelector('#emailed-password-reset-link')){
            document.querySelector('#emailed-password-reset-link').remove();
        }
        if(!document.querySelector('#lupa-password')){
            let forgotPassword = document.createElement('div');
            forgotPassword.classList.add('rounded-bottom');
            forgotPassword.setAttribute('id', 'parent-lupa-password');
            forgotPassword.innerHTML = `<div id="lupa-password">Forgot password?</div>`;
            e.target.parentElement.parentElement.parentElement.insertBefore(forgotPassword, e.target.parentElement.parentElement.nextSibling)
            document.querySelector('#lupa-password').addEventListener('click', lupaPassword)
        }               
        if(document.querySelector('#nama-login')){
            document.querySelector('#nama-login').parentElement.remove();       
        }
        e.target.parentElement.parentElement.parentElement.addEventListener('submit', formMasuk);
        e.target.parentElement.parentElement.parentElement.removeEventListener('submit', formReset);
        e.target.parentElement.parentElement.parentElement.removeEventListener('submit', formDaftar);       
        e.target.setAttribute('id', 'sign-up')
        e.target.innerHTML = 'Sign up';
        e.target.previousElementSibling.innerHTML = "Don't have an account?";
        e.target.parentElement.parentElement.parentElement.querySelector('button[type=submit]').innerHTML = 'Sign in';
    }
}

function renderPengaturanAktivitasKalender(doc){
    let readAdm = doc.data().readAdm;
    let readMem = doc.data().readMem;
    let editAdm = doc.data().editAdm;
    let editMem = doc.data().editMem;
    let delAdm = doc.data().delAdm;
    let delMem = doc.data().delMem;
    document.querySelector('#izin-baca-aktivitas-kalender-adm').checked = readAdm;
    document.querySelector('#izin-baca-aktivitas-kalender-mem').checked = readMem;
    document.querySelector('#izin-edit-aktivitas-kalender-adm').checked = editAdm;
    document.querySelector('#izin-edit-aktivitas-kalender-mem').checked = editMem;
    document.querySelector('#izin-hapus-aktivitas-kalender-adm').checked = delAdm;
    document.querySelector('#izin-hapus-aktivitas-kalender-mem').checked = delMem;
}


function renderAktivitasKalender(doc){
    let username = doc.data().username;
    let date = doc.data().date;
    let description = doc.data().description;
    let event = document.createElement('div');  
    let eventOnList = document.createElement('div');
    let modalEdit = document.createElement('div');
    event.setAttribute('id', 'aktivitas-kalender' + doc.id);
    event.setAttribute('data-id', doc.id);
    event.setAttribute('data-date', Number(date.replace(/-/g, '')));
    event.classList.add('aktivitas-kalender', 'rounded');
    eventOnList.setAttribute('id', 'aktivitas-kalender-onlist' + doc.id);
    eventOnList.setAttribute('data-id', doc.id);
    eventOnList.setAttribute('data-date', date);

    if(document.getElementById(date)){
        if(document.getElementById(date).hasAttribute('current-date')){
            eventOnList.setAttribute('current-event', '');
        } else {
            eventOnList.setAttribute('noncurrent-event', '');
        }
    } else {
        eventOnList.setAttribute('noncurrent-event', '');
    }
    let day = date.slice(8,10);
    let month = date.slice(5,7);
    let year = date.slice(0,4);
    eventOnList.classList.add('aktivitas-kalender-onlist');     
    event.innerHTML = `
    <div class="menu-konfigurasi-aktivitas-kalender">
        <i class='fas fa-copy copy-aktivitas-kalender' id="copy${doc.id}"></i>
        <i class='fas fa-pencil-alt edit-aktivitas-kalender' data-toggle="modal" data-target="#modal-aktivitas-kalender${doc.id}"></i>
        <i class="fa fa-trash hapus-aktivitas-kalender" id="hapus${doc.id}"></i>
    </div>
    <div id="modal-tanggal-aktivitas-kalender${doc.id}" class="modal-tanggal-aktivitas-kalender">${day + ' ' + bulan[Number(month) - 1] + ' ' + year}</div>
    <div id="modal-deskripsi-aktivitas-kalender${doc.id}" class="modal-deskripsi-aktivitas-kalender">${description}</div>
    <usn>${username}</usn>
    `
    eventOnList.innerHTML = `
    <div style="overflow:hidden;">
        <div id="tampilan-deskripsi-aktivitas-kalender${doc.id}" class="tampilan-deskripsi-aktivitas-kalender">${description}</div>
        <usn>${username}</usn>
    </div>
    `   
    modalEdit.innerHTML = `
    <div class="modal fade" id="modal-aktivitas-kalender${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <form id="update-aktivitas-kalender${doc.id}">
            <div class="modal-header">
              <h5 class="modal-title">Edit Content</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Date</label>
                <input class="form-control" type="date" id="tanggal-aktivitas-kalender${doc.id}" value="${date}" required>
              </div>            
              <div class="form-group">
                <label>Description</label>
                <textarea class="form-control" oninput="auto_grow(this)" id="deskripsi-aktivitas-kalender${doc.id}" required>${description.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `

    document.querySelector('#list-aktivitas-kalender').appendChild(event);
    document.querySelector('#list-aktivitas-kalender-onlist').appendChild(eventOnList);
    document.body.appendChild(modalEdit);

    document.querySelector('#copy' + doc.id).addEventListener('click', function(e){
        let range = document.getSelection().getRangeAt(0);
        range.selectNode(document.querySelector("#modal-deskripsi-aktivitas-kalender" + doc.id));
        window.getSelection().addRange(range);
        document.execCommand("copy");       
    })

    document.querySelector('#hapus' + doc.id).addEventListener('click', function(e){
        db.collection('aktivitasKalender').doc(doc.id).delete().then(() => {
            alert('The event has been delete');
        })
    })

    document.querySelector('#update-aktivitas-kalender' + doc.id).addEventListener('submit', function(e){
        e.preventDefault();
        db.collection('aktivitasKalender').doc(doc.id).update({
            date : this['tanggal-aktivitas-kalender' + doc.id].value,
            description : this['deskripsi-aktivitas-kalender' + doc.id].value.replace(/\n\r?/g, '<br/>')
        }).then(() => {
            $('#modal-aktivitas-kalender' + doc.id).modal('hide')
            alert('The event has been update');
        })
    })


}

function renderUpdateAktivitasKalender(doc){
    let date = doc.data().date;
    let day = date.slice(8,10);
    let month = date.slice(5,7);
    let year = date.slice(0,4); 
    let description = doc.data().description;
    document.querySelector('#aktivitas-kalender' + doc.id).setAttribute('data-date', date.replace(/-/g, ''))
    document.querySelector('#aktivitas-kalender-onlist' + doc.id).setAttribute('data-date', date);
    document.querySelector('#tanggal-aktivitas-kalender' + doc.id).value = date;
    document.querySelector('#deskripsi-aktivitas-kalender' + doc.id).value = description.replace(/<br\s*[\/]?>/gi, "\n");
    document.querySelector('#tampilan-deskripsi-aktivitas-kalender' + doc.id).innerHTML = description;
    document.querySelector('#modal-tanggal-aktivitas-kalender' + doc.id).innerHTML = day + ' ' + bulan[Number(month) - 1] + ' ' + year;
    document.querySelector('#modal-deskripsi-aktivitas-kalender' + doc.id).innerHTML = description;

    if(document.querySelector('[current-date]').getAttribute('id') == date){
        document.querySelector('#aktivitas-kalender-onlist' + doc.id).setAttribute('current-event', '');
        document.querySelector('#aktivitas-kalender-onlist' + doc.id).removeAttribute('noncurrent-event');
    } else {
        document.querySelector('#aktivitas-kalender-onlist' + doc.id).setAttribute('noncurrent-event', '');
        document.querySelector('#aktivitas-kalender-onlist' + doc.id).removeAttribute('current-event');
    }
}

function renderPengguna(doc){
    let username = doc.data().username;
    let email = doc.data().email;
    let token = doc.data().token;
    let data = document.createElement('tr');
    let modal = document.createElement('div');
    data.classList.add('text-center');
    data.setAttribute('data-id', doc.id);       
    let custClaim = '';
    if(token != null){
        custClaim = `
        <div class="btn btn-primary" id="set-custom-claims${doc.id}" data-toggle="modal" data-target="#modal-custom-claims${doc.id}"><i class='fas fa-key'></i> Set Custom Claims</div>
        <div class="btn btn-danger" id="remove-custom-claims${doc.id}">Remove Custom Claims</div>
        `
    } else {
        token = `<div on-request on-request-uid-${doc.id}>On Request</div>`
        custClaim = `<div class="btn btn-primary" id="set-custom-claims${doc.id}" data-toggle="modal" data-target="#modal-custom-claims${doc.id}"><i class='fas fa-key'></i> Set Custom Claims</div>`
    }
    data.innerHTML = `
    <td class="align-middle font-weight-bold">${doc.id}</td>
    <td class="align-middle">${username}</td>
    <td class="align-middle">${email}</td>
    <td class="align-middle font-weight-bold user-token" id="user-token${doc.id}">${token}</td>
    <td class="align-middle user-action" id="user-action${doc.id}">${custClaim}</td>
    `
    modal.innerHTML = `
    <div class="modal fade" id="modal-custom-claims${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="tambah-custom-claim${doc.id}">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class='fas fa-key'></i> Set Custom Claims</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>Set ${username}'s custom claims as :</div>
                        <div class="w-50 border m-auto" style="display:grid;grid-template-columns:80% 20%;">
                            <div class="p-1 border-right border-bottom font-weight-bold bg-light">Moderator</div>
                            <div class="border-bottom text-center d-flex"><input type="radio" name="${doc.id}" class="m-auto custom-claims-choice${doc.id}" set-as-moderator disabled></div>
                            <div class="p-1 border-right border-bottom font-weight-bold bg-light">Admin</div>
                            <div class="border-bottom text-center d-flex"><input type="radio" name="${doc.id}" class="m-auto custom-claims-choice${doc.id}" set-as-admin></div>
                            <div class="p-1 border-right font-weight-bold bg-light">Member</div>
                            <div class="text-center d-flex"><input type="radio" name="${doc.id}" class="m-auto custom-claims-choice${doc.id}" set-as-member></div>
                        </div>          
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>      
    `

    document.querySelector('#list-req-custom-claim').appendChild(data);     
    document.body.appendChild(modal);

    switch(token){
        case 'admin':
        for(let x = 0;x<document.querySelectorAll('.custom-claims-choice' + doc.id).length; x++){
            if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-admin')){
                document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked = true;
            }
        }           
        break;
        case 'member':
        for(let x = 0;x<document.querySelectorAll('.custom-claims-choice' + doc.id).length; x++){
            if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-member')){
                document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked = true;
            }
        }           
    }

    document.querySelector('#tambah-custom-claim' + doc.id).addEventListener('submit', function(e){
        e.preventDefault();
        for(let x = 0;x<document.querySelectorAll('.custom-claims-choice' + doc.id).length;x++){
            if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked){
                if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-admin')){
                    db.collection('user').doc(doc.id).get().then(item => {
                        if(item.data().token != 'admin'){
                            db.collection('user').doc(doc.id).update({
                                token : 'admin'
                            })
                        } else {
                            alert("this user's custom claims already setted as admin");
                        }
                    })
                } else if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-member')){
                    db.collection('user').doc(doc.id).get().then(item => {
                        if(item.data().token != 'member'){
                            db.collection('user').doc(doc.id).update({
                                token : 'member'
                            })
                        } else {
                            alert("this user's custom claims already setted as member");
                        }
                    })
                }
            }
        }
    })

    if(document.querySelector('#remove-custom-claims' + doc.id)){
        document.querySelector('#remove-custom-claims' + doc.id).addEventListener('click', function(e){
            db.collection('user').doc(doc.id).update({
                token : firebase.firestore.FieldValue.delete()
            })
        })
    }

}

function renderUpdatePengguna(doc){
    let username = doc.data().username;
    let email = doc.data().email;
    let token = doc.data().token;
    let addAdminRole = functions.httpsCallable('addAdminRole');
    let addMemberRole = functions.httpsCallable('addMemberRole');
    let removeRole = functions.httpsCallable('removeRole');
    let refreshRoleAdminKantor;
    let refreshRoleMember;
    let refreshRemoveRole;

    if(token == null){
        removeRole({email: email}).then(() => {
            if(auth.currentUser.email == email){
                auth.onAuthStateChanged(user => {
                    user.getIdToken(true).then(() => {
                        user.getIdTokenResult().then(idTokenResult => {
                            refreshRemoveRole = setInterval(refreshRemoveRole,10);
                            function refreshRemoveRole(){
                                if(idTokenResult.claims.adminKantor == false && idTokenResult.claims.member == false){
                                    clearInterval(refreshRemoveRole)
                                    alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh kembali. Jika tidak terdapat perubahan apapun pada tampilan website, Diharapkan anda keluar dan masuk lagi kembali pada website.')
                                    window.location.reload();
                                }
                            }
                        })
                    })
                })
            }
        })
    } else {
        switch(token){
            case 'admin':
            addAdminRole({email: email}).then(() => {
                if(auth.currentUser.email == email){
                    auth.onAuthStateChanged(user => {
                        user.getIdToken(true).then(() => {
                            user.getIdTokenResult().then(idTokenResult => {
                                refreshRoleAdminKantor = setInterval(refreshRoleAdminKantor,10);
                                function refreshRoleAdminKantor(){
                                    if(idTokenResult.claims.adminKantor == true){
                                        clearInterval(refreshRoleAdminKantor)
                                        alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh kembali. Jika tidak terdapat perubahan apapun pada tampilan website, Diharapkan anda keluar dan masuk lagi kembali pada website.')
                                        window.location.reload();
                                    }
                                }                                
                            })
                        })
                    })
                }
            })      
            break;
            case 'member':
            addMemberRole({email: email}).then(() => {
                if(auth.currentUser.email == email){
                    auth.onAuthStateChanged(user => {
                        user.getIdToken(true).then(() => {
                            user.getIdTokenResult().then(idTokenResult => {
                                refreshRoleMember = setInterval(refreshRoleMember,10);
                                function refreshRoleMember(){
                                    if(idTokenResult.claims.member == true){
                                        clearInterval(refreshRoleMember)
                                        alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh kembali. Jika tidak terdapat perubahan apapun pada tampilan website, Diharapkan anda keluar dan masuk lagi kembali pada website.')
                                        window.location.reload();
                                    }
                                }                                 
                            })
                        })
                    })                
                }
            })         
        }
    }
}

function renderTugas(doc){

}

function renderUpdateTugas(doc){

}

function auto_grow(element){
    element.style.height = (element.scrollHeight)+"px";
}
document.body.addEventListener('click', function(){
    [document.querySelector('#user-info')].forEach(item => {
        if(item){
            item.remove();
        }
    })
})

const setupUI = (user) => {   
    if(user){
        if(user.emailVerified){
            document.body.style.setProperty('background-color', '#eeeeee', 'important');
            document.querySelector('#form-masuk').remove();
            user.getIdTokenResult().then(idTokenResult => {
                if(idTokenResult.claims.moderator || idTokenResult.claims.adminKantor || idTokenResult.claims.member){
                    document.querySelector('#navbar').style.display = 'grid';
                    document.querySelector('#nav-sidebar').classList.add('d-block');
                    document.querySelector('#nav-sidebar').classList.remove('d-none');
                    document.querySelector('#myTabContent').classList.add('d-block');
                    document.querySelector('#myTabContent').classList.remove('d-none');
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

                    } else if(window.innerWidth > 1300){

                    }

                    window.addEventListener('resize', windowResize)
                }

                if(idTokenResult.claims.moderator || idTokenResult.claims.adminKantor){
                    document.querySelector('#set-due-date-task').addEventListener('change', function(){
                        if(this.checked){
                            document.querySelector('[set-due-date-hd]').classList.add('text-primary');
                            document.querySelector('[set-due-date-bd]').classList.add('d-block');
                            document.querySelector('[set-due-date-bd]').classList.remove('d-none');
                            document.querySelector('[not-set-due-date-hd]').classList.remove('text-primary');
                            document.querySelector('[not-set-due-date-bd]').classList.add('d-none')
                            document.querySelector('[not-set-due-date-bd]').classList.remove('d-block');;

                            document.querySelector('#due-date-basis').addEventListener('change', function(){
                                document.querySelector('#due-date-input').disabled = false;
                                switch (this.value){
                                    case "Week":
                                        document.querySelector('#due-date-input').setAttribute('max', '50');
                                    break;
                                    case "Day":
                                        document.querySelector('#due-date-input').setAttribute('max', '360');
                                    break;
                                    case "Hour":
                                        document.querySelector('#due-date-input').setAttribute('max', '168');
                                    break;
                                    case "Minute":
                                        document.querySelector('#due-date-input').setAttribute('max', '1440');
                                }
                            })

                        }
                    })
                    document.querySelector('#not-set-due-date-task').addEventListener('change', function(){
                        if(this.checked){
                            document.querySelector('[not-set-due-date-hd]').classList.add('text-primary');
                            document.querySelector('[not-set-due-date-bd]').classList.add('d-block');
                            document.querySelector('[not-set-due-date-bd]').classList.remove('d-none');
                            document.querySelector('[set-due-date-hd]').classList.remove('text-primary');
                            document.querySelector('[set-due-date-bd]').classList.add('d-none')
                            document.querySelector('[set-due-date-bd]').classList.remove('d-block');

                            document.querySelector('#due-date-basis').selectedIndex = 0
                            document.querySelector('#due-date-input').disabled = true;


                        }
                    })                    
                }                

                if(idTokenResult.claims.moderator){
                    
                } else if(idTokenResult.claims.adminKantor){
                    
                } else if(idTokenResult.claims.member){
                    document.querySelector('#tombol-tambah-tugas').classList.add('d-none');
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
                        db.collection('user').doc(auth.currentUser.uid).get().then(doc => {
                            if(doc.exists){
                                if(doc.data().token != null){
                                    user.getIdTokenResult().then(idTokenResult => {
                                        user.getIdToken(true).then(() => {
                                            alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh.');
                                            window.location.reload();
                                        });
                                    });
                                }
                            } else {
                                db.collection('user').doc(auth.currentUser.uid).collection('property').doc('user-info').set({
                                    username : auth.currentUser.displayName,
                                    email : auth.currentUser.email
                                }).then(() => {
                                    alert('Your request has been sended!');
                                })
                            }
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
                    item.classList.add('d-block');
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
        document.querySelector('#nav-sidebar').classList.add('d-none');
        document.querySelector('#myTabContent').classList.add('d-none');
        document.querySelector('#nav-sidebar').classList.remove('d-block');
        document.querySelector('#myTabContent').classList.remove('d-block');        
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
            document.querySelector('#form-masuk').classList.add('d-block');

            document.querySelector('#form-masuk').addEventListener('submit', formMasuk);
            document.querySelector('#lupa-password').addEventListener('click', lupaPassword);

        } else {
            document.querySelector('#form-masuk').classList.add('d-block');
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

    } else if(window.innerWidth > 1300){

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

function renderPengguna(doc){
    db.collection('user').doc(doc.id).collection('property').doc('user-info').get().then(subDoc => {
        let username = subDoc.data().username;
        let email = subDoc.data().email;
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
            let optionTask = document.createElement('option');
            optionTask.setAttribute('uid', doc.id);
            optionTask.innerHTML = username;
            document.querySelector('#penerima-tugas').appendChild(optionTask);
            let items = $('#penerima-tugas > option').get();
            items.sort(function(a, b) {
                let keyA = $(a).text();
                let keyB = $(b).text();
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            })
            let list = $('#penerima-tugas');
            $.each(items, function(i, div){
                list.append(div);
            })        
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
                                }).catch(err => {
                                    return firebaseError(err);
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
                                }).catch(err => {
                                    return firebaseError(err);
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
                }).catch(err => {
                    return firebaseError(err);
                })
            })
        }
    })
}

function renderUpdatePengguna(doc){
    db.collection('user').doc(doc.id).collection('property').doc('user-info').get().then(subDoc => {
        let username = subDoc.data().username;
        let email = subDoc.data().email;
        let token = doc.data().token;
        let addAdminRole = functions.httpsCallable('addAdminRole');
        let addMemberRole = functions.httpsCallable('addMemberRole');
        let removeRole = functions.httpsCallable('removeRole');
        let refreshRoleAdminKantor;
        let refreshRoleMember;
        let refreshRemoveRole;
        if(token == null){
            removeRole({email: email}).then(() => {
                document.querySelector('#remove-custom-claims' + doc.id).remove();
                for(let x = 0; x<document.querySelectorAll('.custom-claims-choice' + doc.id).length; x++){
                    document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked = false;
                }
                if(auth.currentUser.email == email){
                    auth.onAuthStateChanged(user => {
                        user.getIdTokenResult().then(idTokenResultBef => {
                            if(idTokenResultBef.claims.moderator != false && idTokenResultBef.claims.adminKantor != false && idTokenResultBef.claims.member != false){
                                user.getIdToken(true).then(() => {
                                    user.getIdTokenResult().then(idTokenResultAft => {
                                        refreshRemoveRole = setInterval(refreshRemoveRole,10);
                                        function refreshRemoveRole(){
                                            if(idTokenResultAft.claims.moderator == false && idTokenResultAft.claims.adminKantor == false && idTokenResultAft.claims.member == false){
                                                clearInterval(refreshRemoveRole)
                                                alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh.');
                                                window.location.reload();
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            })
            document.querySelector('#user-token' + doc.id).innerHTML = `<div on-request on-request-uid-${doc.id}>On Request</div>`;
            document.querySelector('#penerima-tugas').querySelector('[uid="' + doc.id + '"]').remove();            
        } else {
            switch(token){
                case 'admin':
                addAdminRole({email: email}).then(() => {
                    for(let x = 0; x<document.querySelectorAll('.custom-claims-choice' + doc.id).length; x++){
                        if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-admin')){
                            document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked = true;
                        }
                    }                                
                    document.querySelector('#user-token' + doc.id).innerHTML = token;
                    if(auth.currentUser.email == email){
                        auth.onAuthStateChanged(user => {
                            user.getIdTokenResult().then(idTokenResultBef => {
                                if(idTokenResultBef.claims.adminKantor != true){
                                    user.getIdToken(true).then(() => {
                                        user.getIdTokenResult().then(idTokenResultAft => {
                                            refreshRoleAdminKantor = setInterval(refreshRoleAdminKantor,10);
                                            function refreshRoleAdminKantor(){                                            
                                                if(idTokenResultAft.claims.adminKantor == true){
                                                    clearInterval(refreshRoleAdminKantor)
                                                    alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh.');
                                                    window.location.reload();
                                                }
                                            }                                
                                        })
                                    })
                                } else {
                                    if(!document.querySelector('#remove-custom-claims' + doc.id)){
                                        let removeCustomClaims = document.createElement('div');
                                        removeCustomClaims.setAttribute('id', 'remove-custom-claims' + doc.id);
                                        removeCustomClaims.classList.add('btn', 'btn-danger');
                                        removeCustomClaims.innerHTML = 'Remove Custom Claims';
                                        document.querySelector('#set-custom-claims' + doc.id).parentElement.insertBefore(removeCustomClaims, document.querySelector('#set-custom-claims' + doc.id).nextSibling);

                                        document.querySelector('#remove-custom-claims' + doc.id).addEventListener('click', function(e){
                                            db.collection('user').doc(doc.id).update({
                                                token : firebase.firestore.FieldValue.delete()
                                            }).catch(err => {
                                                return firebaseError(err)
                                            })
                                        })
                                    }                                    
                                }
                            })
                        })
                    }
                })      
                break;
                case 'member':
                addMemberRole({email: email}).then(() => {                
                    for(let x = 0; x<document.querySelectorAll('.custom-claims-choice' + doc.id).length; x++){
                        if(document.querySelectorAll('.custom-claims-choice' + doc.id)[x].hasAttribute('set-as-member')){
                            document.querySelectorAll('.custom-claims-choice' + doc.id)[x].checked = true;
                        }
                    }                  
                    document.querySelector('#user-token' + doc.id).innerHTML = token;
                    if(auth.currentUser.email == email){
                        auth.onAuthStateChanged(user => {
                            user.getIdTokenResult().then(idTokenResultBef => {
                                if(idTokenResultBef.claims.member != true){
                                    user.getIdToken(true).then(() => {
                                        user.getIdTokenResult().then(idTokenResultAft => {
                                            refreshRoleMember = setInterval(refreshRoleMember,10);
                                            function refreshRoleMember(){
                                                if(idTokenResultAft.claims.member == true){
                                                    clearInterval(refreshRoleMember)
                                                    alert('Terdapat suatu perubahan pada tampilan halaman website anda, halaman akan direfresh.')
                                                    window.location.reload();
                                                }
                                            }                                 
                                        })
                                    })
                                } else {
                                    if(!document.querySelector('#remove-custom-claims' + doc.id)){
                                        let removeCustomClaims = document.createElement('div');
                                        removeCustomClaims.setAttribute('id', 'remove-custom-claims' + doc.id);
                                        removeCustomClaims.classList.add('btn', 'btn-danger');
                                        removeCustomClaims.innerHTML = 'Remove Custom Claims';
                                        document.querySelector('#set-custom-claims' + doc.id).parentElement.insertBefore(removeCustomClaims, document.querySelector('#set-custom-claims' + doc.id).nextSibling);

                                        document.querySelector('#remove-custom-claims' + doc.id).addEventListener('click', function(e){
                                            db.collection('user').doc(doc.id).update({
                                                token : firebase.firestore.FieldValue.delete()
                                            }).catch(err => {
                                                return firebaseError(err)
                                            })
                                        })
                                    }
                                }
                            })
                        })                
                    }
                })                     
            }
            if(!document.querySelector('#remove-custom-claims' + doc.id)){
                let removeCustomClaims = document.createElement('div');
                removeCustomClaims.setAttribute('id', 'remove-custom-claims' + doc.id);
                removeCustomClaims.classList.add('btn', 'btn-danger');
                removeCustomClaims.innerHTML = 'Remove Custom Claims';
                document.querySelector('#set-custom-claims' + doc.id).parentElement.insertBefore(removeCustomClaims, document.querySelector('#set-custom-claims' + doc.id).nextSibling);

                document.querySelector('#remove-custom-claims' + doc.id).addEventListener('click', function(e){
                    db.collection('user').doc(doc.id).update({
                        token : firebase.firestore.FieldValue.delete()
                    }).catch(err => {
                        return firebaseError(err)
                    })
                })
            }        
            if(!document.querySelector('#penerima-tugas').querySelector('[uid="' + doc.id + '"]')){
                let optionTask = document.createElement('option');
                optionTask.setAttribute('uid', doc.id);
                optionTask.innerHTML = username;
                document.querySelector('#penerima-tugas').appendChild(optionTask);
                let items = $('#penerima-tugas > option').get();
                items.sort(function(a, b) {
                    let keyA = $(a).text();
                    let keyB = $(b).text();
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                })
                let list = $('#penerima-tugas');
                $.each(items, function(i, div){
                    list.append(div);
                })
            }
        }
    })
}

function renderPengaturanTugas(doc){
    let completeAdm = doc.data().completeAdm;
    let completeMem = doc.data().completeMem;
    let completeAse = doc.data().completeAse;
    let readAdm = doc.data().readAdm;
    let readMem = doc.data().readMem;
    let readAse = doc.data().readAse;
    let editAdm = doc.data().editAdm;
    let editMem = doc.data().editMem;
    let editAse = doc.data().editAse;
    let delAdm = doc.data().delAdm;
    let delMem = doc.data().delMem;
    let delAse = doc.data().delAse;
    let permission = [completeAdm, completeMem, completeAse, readAdm, readMem, readAse, editAdm, editMem, editAse, delAdm, delMem, delAse];
    [document.querySelector('#izin-selesai-tugas-adm'), document.querySelector('#izin-selesai-tugas-mem'), document.querySelector('#izin-selesai-tugas-rec'),
    document.querySelector('#izin-baca-tugas-adm'), document.querySelector('#izin-baca-tugas-mem'), document.querySelector('#izin-baca-tugas-rec'),
    document.querySelector('#izin-edit-tugas-adm'), document.querySelector('#izin-edit-tugas-mem'), document.querySelector('#izin-edit-tugas-rec'),
    document.querySelector('#izin-hapus-tugas-adm'), document.querySelector('#izin-hapus-tugas-mem'), document.querySelector('#izin-hapus-tugas-rec')].forEach((item, index) => {
        if(permission[index] == true){
            item.checked = true;
        } else {
            item.checked = false;
        }
    })
}

function renderTugas(doc){
    let dateRelease = doc.data().dateRelease;
    let targetedUsername = doc.data().targetedUsername;
    let targetedUserUID = doc.data().targetedUserUID;
    let status = doc.data().status;
    let description = doc.data().description;
    let dateDueExists = doc.data().dateDueExists;
    let dateDue = doc.data().dateDue;
    let late = doc.data().late;
    let dateCompletion = doc.data().dateCompletion;
    let dateDueWeek = doc.data().dateDueWeek;
    let dateDueDay = doc.data().dateDueDay;
    let dateDueHour = doc.data().dateDueHour;
    let dateDueMinute = doc.data().dateDueMinute;
    let dateDueInput = 0;
    let checked;
    let setDueDate;
    let notSetDueDate;
    if(dateDueExists){
        setDueDate = 'checked';
        if(dateDueWeek){
            dateDueWeek = 'selected';
            dateDueInput = (dateDue - dateRelease)/(7 * 24 * 60 * 60 * 1000)
        } else if(dateDueDay){
            dateDueDay = 'selected';
            dateDueInput = (dateDue - dateRelease)/(24 * 60 * 60 * 1000)
        } else if(dateDueHour){
            dateDueHour = 'selected';
            dateDueInput = (dateDue - dateRelease)/(60 * 60 * 1000)
        } else if(dateDueMinute){
            dateDueMinute = 'selected';
            dateDueInput = (dateDue - dateRelease)/(60 * 1000)
        }       
        let hourDue = String(new Date(dateDue).getHours()).padStart(2, '0');
        let minuteDue = String(new Date(dateDue).getMinutes()).padStart(2, '0');
        let dayDue = String(new Date(dateDue).getDate()).padStart(2, '0');
        let monthDue = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthDue = monthDue[new Date(dateDue).getMonth()];
        let yearDue = new Date(dateDue).getFullYear();        
        dateDue = hourDue + ':' + minuteDue + ' / ' + dayDue + ' ' + monthDue + ' ' + yearDue;
        switch(status){
            case "PENDING":
            status = "<div class='text-danger font-italic'>has not been completed yet</div>";
            dateCompletion = '-';
            break;
            case "COMPLETE":
            checked = 'checked';
            let hourCompletion = String(new Date(dateCompletion).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(dateCompletion).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(dateCompletion).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(dateCompletion).getMonth()];
            let yearCompletion = new Date(dateCompletion).getFullYear();        
            dateCompletion = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
            if(late){
                status = "<div class='text-success font-italic'>Late completion and has been completed</div>";
            } else {
                status = "<div class='text-success font-italic'>has been completed</div>";
            }            
        }
    } else {
        switch(status){
            case "PENDING":
            status = "<div class='text-danger font-italic'>has not been completed yet</div>";
            dateCompletion = '-';
            break;
            case "COMPLETE":
            status = "<div class='text-success font-italic'>has been completed</div>";
            checked = 'checked';
            let hourCompletion = String(new Date(dateCompletion).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(dateCompletion).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(dateCompletion).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(dateCompletion).getMonth()];
            let yearCompletion = new Date(dateCompletion).getFullYear();        
            dateCompletion = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
        }
        notSetDueDate = 'checked';
        dateDue = 'none';
    }
    let task = document.createElement('div');
    let modalInfo = document.createElement('div');
    let modalEdit = document.createElement('div');
    task.setAttribute('data-id', doc.id);
    let hourRelease = String(new Date(dateRelease).getHours()).padStart(2, '0');
    let minuteRelease = String(new Date(dateRelease).getMinutes()).padStart(2, '0');
    let dayRelease = String(new Date(dateRelease).getDate()).padStart(2, '0');
    let monthRelease = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthRelease = monthRelease[new Date(dateRelease).getMonth()];
    let yearRelease = new Date(dateRelease).getFullYear();
    dateRelease = hourRelease + ':' + minuteRelease + ' / ' + dayRelease + ' ' + monthRelease + ' ' + yearRelease;
    task.classList.add('my-2', 'position-relative', 'align-items-center', 'bg-light', 'tugas');
    task.innerHTML = `
    <input type="checkbox" class="checkbox-permission m-auto" id="checkbox-tugas${doc.id}" ${checked}>
    <div class="py-3 deskripsi-tugas" id="deskripsi-tugas${doc.id}" data-toggle="modal" data-target="#modal-tugas${doc.id}">${description}</div>
    `
    modalInfo.innerHTML = `
    <div class="modal fade" id="modal-tugas${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="pengaturan-tugas">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title">Information About Task</h5>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped table-bordered mb-0 tabel-tugas">
                            <thead>
                                <tr>
                                    <th scope="col" colspan="3" class="p-1 border-bottom-0 text-left font-weight-bold">Information About Task</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="p-1">Release Date</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1">${dateRelease}</td>
                                </tr>              
                                <tr>
                                    <td class="p-1">Completion Date</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1" id="tanggal-penyelesaian-tugas${doc.id}">${dateCompletion}</td>
                                </tr>
                                <tr>
                                    <td class="p-1">Due Date</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1 w-50" id="tanggal-berakhir-tugas${doc.id}">${dateDue}</td>
                                </tr>                                
                                <tr>
                                    <td class="p-3" colspan="3"></td>
                                </tr>
                                <tr>
                                    <td class="p-1">Status</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1" id="status-tugas${doc.id}">${status}</td>
                                </tr>
                                <tr>
                                    <td class="p-1">Action</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1">
                                        <i class="material-icons bg-warning rounded p-1 task-action" data-toggle="modal" data-target="#modal-edit-tugas${doc.id}">edit</i>
                                        <i class="material-icons bg-danger rounded p-1 task-action text-light" id="delete${doc.id}">delete_forever</i>
                                    </td>
                                </tr>                                
                                <tr>
                                    <td class="p-1" colspan="3">
                                        <div class="font-weight-bold">Task Description :</div>
                                        <div>${description}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `

    modalEdit.innerHTML = `
    <div class="modal fade" id="modal-edit-tugas${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form id="tambah-tugas">
                    <div class="modal-header">
                        <h5 class="modal-title">Create a task <i class="fa fa-gear" id="tombol-pengaturan-tugas" data-toggle="modal" data-target="#modal-pengaturan-tugas"></i></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">          
                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-control" oninput="auto_grow(this)" id="deskripsi-tugas${doc.id}" required>${description.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                        </div>
                        <div class="form-group bg-light border p-2">
                            <label class="font-weight-bold">Additional Settings</label>
                            <div class="d-flex mb-2">
                                <input class="m-1" type="radio" name="task" id="set-due-date-task${doc.id}" ${setDueDate}>
                                <div>
                                    <div set-due-date-hd class="font-weight-bold">Set due date on a task</div>
                                    <div set-due-date-bd class="d-none">
                                        <div>Due date completion will be based on :</div>
                                        <div class="d-flex">
                                            <select class="form-control w-50 mr-2" id="due-date-basis${doc.id}">
                                                <option disabled hidden>-</option>
                                                <option ${dateDueWeek}>Week</option>
                                                <option ${dateDueDay}>Day</option>
                                                <option ${dateDueHour}>Hour</option>
                                                <option ${dateDueMinute}>Minute</option>
                                            </select>
                                            <input type="number" class="form-control w-50" value="${dateDueInput}" id="due-date-input${doc.id}" min="0" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>            
                            <div class="d-flex mb-2">
                                <input class="m-1" type="radio" name="task" id="not-set-due-date-task${doc.id}" ${notSetDueDate}>
                                <div>
                                    <div not-set-due-date-hd class="font-weight-bold text-primary">Don't set due date on a task</div>
                                    <div not-set-due-date-bd class="d-block">The Assignee would be freely to complete the related task anytime</div>
                                </div>
                            </div>
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

    document.querySelector('#list-tugas').appendChild(task);
    document.body.appendChild(modalInfo);
    document.body.appendChild(modalEdit);

    document.querySelector('#checkbox-tugas' + doc.id).addEventListener('change', function(){
        if(this.checked){
            db.collection('tugass').doc(doc.id).get().then(item => {
                let late;
                if(item.data().dateDueExists){
                    if(new Date().getTime() > item.data().dateDue){
                        late = true;
                    } else {
                        late = false;
                    }
                } else {
                    late = firebase.firestore.FieldValue.delete();
                }
                db.collection('tugass').doc(doc.id).update({
                    status : 'COMPLETE',
                    dateCompletion : new Date().getTime(),
                    late : late
                }).catch(err => {
                    return firebaseError(err);
                })                
            })            
        } else {
            db.collection('tugass').doc(doc.id).update({
                status : 'PENDING',
                dateCompletion : firebase.firestore.FieldValue.delete(),
                late : firebase.firestore.FieldValue.delete()
            }).catch(err => {
                return firebaseError(err);
            })            
        }
    })

    document.querySelector('#delete' + doc.id).addEventListener('click', function(){
        let alert = confirm('Are you sure want to delete this task?');
        if(alert){
            db.collection('tugass').doc(doc.id).delete().then(() => {
                $('#modal-tugas' + doc.id).modal('hide');
                document.querySelector('#modal-tugas' + doc.id).parentElement.remove();
            })
        }
    })
}

function renderUpdateTugas(doc){
    let status = doc.data().status;
    let dateDueExists = doc.data().dateDueExists;
    let dateDue = doc.data().dateDue;
    let dateCompletion = doc.data().dateCompletion;
    let late = doc.data().late;
    if(dateDueExists){
        let hourDue = String(new Date(dateDue).getHours()).padStart(2, '0');
        let minuteDue = String(new Date(dateDue).getMinutes()).padStart(2, '0');
        let dayDue = String(new Date(dateDue).getDate()).padStart(2, '0');
        let monthDue = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthDue = monthDue[new Date(dateDue).getMonth()];
        let yearDue = new Date(dateDue).getFullYear();        
        dateDue = hourDue + ':' + minuteDue + ' / ' + dayDue + ' ' + monthDue + ' ' + yearDue;
        switch(status){
            case "PENDING":
            status = "<div class='text-danger font-italic'>has not been completed yet</div>";
            dateCompletion = '-';
            break;
            case "COMPLETE":
            document.querySelector('#checkbox-tugas' + doc.id).checked = true;
            let hourCompletion = String(new Date(dateCompletion).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(dateCompletion).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(dateCompletion).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(dateCompletion).getMonth()];
            let yearCompletion = new Date(dateDue).getFullYear();        
            dateCompletion = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
            if(late){
                status = "<div class='text-success font-italic'>Late completion and has been completed</div>";
            } else {
                status = "<div class='text-success font-italic'>has been completed</div>";
            }            
        }
    } else {
        switch(status){
            case "PENDING":
            status = "<div class='text-danger font-italic'>has not been completed yet</div>";
            dateCompletion = '-';
            break;
            case "COMPLETE":
            status = "<div class='text-success font-italic'>has been completed</div>";
            checked = 'checked';
            let hourCompletion = String(new Date(dateCompletion).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(dateCompletion).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(dateCompletion).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(dateCompletion).getMonth()];
            let yearCompletion = new Date(dateCompletion).getFullYear();        
            dateCompletion = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
        }
        dateDue = 'none';        
    }
    document.querySelector('#tanggal-penyelesaian-tugas' + doc.id).innerHTML = dateCompletion;
    document.querySelector('#status-tugas' + doc.id).innerHTML = status;
    document.querySelector('#tanggal-berakhir-tugas' + doc.id).innerHTML = dateDue;
}

function auto_grow(element){
    element.style.height = (element.scrollHeight)+"px";
}
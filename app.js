const setupUI = (user) => {   
    if(user){
        document.body.classList.add('snow');
        document.body.classList.remove('poltergeist');
        authForm.forEach(form => {
            if(form.classList.contains('d-block')){
                form.classList.add('d-none');
                form.classList.remove('d-block');
            }
        })
        document.querySelectorAll('.due-date-control').forEach(item => {
            item.addEventListener('change', function(){
                document.querySelectorAll('.due-date-lab').forEach(lab => {
                    lab.classList.toggle('text-primary')
                })
                document.querySelectorAll('.due-date-bod').forEach(bod => {
                    bod.classList.toggle('d-block');
                })
            })
        })
        if(user.emailVerified){
            user.getIdTokenResult().then(idTokenResult => {                

                if(idTokenResult.claims.moderator){
                    
                } else if(idTokenResult.claims.adminKantor){
                    
                } else if(idTokenResult.claims.member){

                } else {
                    let request = document.createElement('form');
                    request.classList.add('auth-form', 'bg-white', 'rounded', 'my-5', 'mx-auto', 'd-block', 'p-3');
                    request.setAttribute('name', 'custom-claim-form');
                    request.innerHTML = `
                    <h4 class="mb-1 auth-form-label">One Step Ahead</h4>
                    <div class="mb-2">You may required to contact and send a requests to your devs! so we would grant you to have an access to this website.</div>
                    <button type="submit" class="btn text-white font-weight-bold">Send Request</button>
                    `
                    document.body.appendChild(request);

                    document.querySelector('.auth-form[name=custom-claim-form]').addEventListener('submit', function(e){
                        e.preventDefault();
                        db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
                            if(doc.exists){
                                if(doc.data().token != null){
                                    user.getIdToken(true).then(() => {
                                        alert("There's a change in page views, page will be refresh")
                                        window.location.reload();
                                    })                         
                                } else {
                                    alert('Request has already been sent before')
                                }    
                            } else {
                                db.collection('users').doc(auth.currentUser.uid).set({
                                    name : auth.currentUser.displayName
                                }).then(() => {
                                    db.collection('users').doc(auth.currentUser.uid).collection('obj').doc('property').set({
                                        email : auth.currentUser.email
                                    }).then(() => {
                                        alert('Request have been sent')
                                    })
                                })                                                                 
                            }
                        })
                    })                     
                }
            })
        } else {
            let verifyEmail = document.createElement('form');
            verifyEmail.classList.add('auth-form', 'bg-white', 'rounded', 'my-5', 'mx-auto', 'd-block');
            verifyEmail.setAttribute('name', 'verify-email-form');
            verifyEmail.innerHTML = `
            <div class="pt-4 px-3 pb-4 position-relative">
            <h4 class="font-weight-bold text-center auth-form-label">Verify Your Email</h4>
            <div>We have sent an email to :</div>
            <div class="font-weight-bold mb-2">${auth.currentUser.email}</div>
            <div>You need to verify your email to continue.</div>
            <div class="mb-2">If you have not received the verification email, please check your "Spam" folder. You can also click the resend button below to have another email sent to you.</div>
            <button type="submit" class="text-white font-weight-bold btn d-block w-100 rounded-0 mb-2">Check again and continue</button>
            <a href="#" class="text-secondary my-2 font-weight-bold text-decoration-none" id="resend-verification-email">Resend verification email</a>
            </div>
            `
            document.body.appendChild(verifyEmail)

            document.querySelector('.auth-form[name=verify-email-form]').addEventListener('submit', function(e){
                e.preventDefault();
                auth.currentUser.reload();
                if(auth.currentUser.emailVerified){
                    alert("Your email has been verified! You'll be signed out of websites");
                    auth.signOut();
                } else {
                    alert("Your email hasn't been verified!");
                }
            });

            document.querySelector('#resend-verification-email').addEventListener('click', function(){
                auth.currentUser.sendEmailVerification().then(() => {
                    alert('Verification email has been sent!')
                }).catch(err => {
                    alert(err.message);
                });
            });

        }
    } else {
        document.body.classList.remove('snow');
        document.body.classList.add('poltergeist');
        document.querySelectorAll('.auth-form').forEach(form => {
            if(form.getAttribute('name') == 'verify-email-form'){
                form.remove();
            }
            if(form.getAttribute('name') == 'login-form'){
                form.classList.add('d-block');
                form.classList.remove('d-none');
            } else {
                form.classList.add('d-none');
                form.classList.remove('d-block');
            }
        });
    }
};

function renderPengguna(doc){
    db.collection('users').doc(doc.id).collection('obj').doc('property').get().then(secDoc => {
        let name = doc.data().name;
        let token = doc.data().token;
        let email = secDoc.data().email;
        let tr = document.createElement('tr');
        let inputAdmin, inputAdminLabel, inputMember, inputMemberLabel, inputNone, inputNoneLabel;
        inputAdmin = inputAdminLabel = inputMember = inputMemberLabel = inputNone = inputNoneLabel = '';
        switch(token){
            case "admin":
            inputAdmin = 'checked';
            inputAdminLabel = ' text-primary font-weight-bold';
            break;
            case "member":
            inputMember = 'checked';
            inputMemberLabel = ' text-primary font-weight-bold';
            break;
            default:
            inputNone = 'checked';
            inputNoneLabel = ' text-primary font-weight-bold';
        }
        tr.innerHTML = `
        <td class="text-center align-middle fs-1">${email}</td>
        <td class="text-center align-middle fs-1">${name}</td>
        <td class="text-center align-middle fs-1">
            <div class="d-flex justify-content-center">       
                <div class="d-flex align-items-center mr-2">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input${doc.id}" set-as-admin ${inputAdmin}>
                    <div class="custom-claim-label${doc.id}${inputAdminLabel}" set-as-admin-lab>Admin</div>
                </div>
                <div class="d-flex align-items-center mr-2">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input${doc.id}" set-as-member ${inputMember}>
                    <div class="custom-claim-label${doc.id}${inputMemberLabel}" set-as-member-lab>Member</div>
                </div>
                <div class="d-flex align-items-center">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input${doc.id}" set-as-none ${inputNone}>
                    <div class="custom-claim-label${doc.id}${inputNoneLabel}" set-as-none-lab>None</div>
                </div>                
            </div>            
        </td>
        <td class="text-center align-middle fs-1">${doc.id}</td>
        `
        document.querySelector('#custom-claim-request-list').appendChild(tr)

        document.querySelectorAll('.custom-claim-input' + doc.id).forEach(input => {
            input.addEventListener('change', function(){
                if(this.checked){
                    if(this.hasAttribute('set-as-admin')){
                        db.collection('users').doc(doc.id).get().then(item => {
                            if(item.data().token == 'admin'){
                                alert(`${name} token have already been setted as an admin`);
                            } else {
                                db.collection('users').doc(doc.id).update({
                                    token : 'admin'
                                }).then(() => {
                                    alert(`${name} token have been set as an admin`);
                                })
                            }
                        })
                    } else if(this.hasAttribute('set-as-member')){
                        db.collection('users').doc(doc.id).get().then(item => {
                            if(item.data().token == 'member'){
                                alert(`${name} token have already been setted as an member`);
                            } else {
                                db.collection('users').doc(doc.id).update({
                                    token : 'member'
                                }).then(() => {
                                    alert(`${name} token have been set as a member`);
                                })                                    
                            }                    
                        })
                    } else if(this.hasAttribute('set-as-none')){
                        db.collection('users').doc(doc.id).get().then(item => {
                            if(item.data().token == null){
                                alert(`${name} token have already been removed`);
                            } else {
                                db.collection('users').doc(doc.id).update({
                                    token : firebase.firestore.FieldValue.delete()
                                }).then(() => {
                                    alert(`${name} token have been remove`);
                                })                                    
                            }                    
                        })                        
                    }
                }
            })
        })


    })
}

function renderUpdatePengguna(doc){
    db.collection('users').doc(doc.id).collection('obj').doc('property').get().then(secDoc => {
        let addAdmin = functions.httpsCallable('addAdmin');
        let addMember = functions.httpsCallable('addMember');
        let removeToken = functions.httpsCallable('removeToken');    
        let token = doc.data().token;
        let email = secDoc.data().email;          
        if(token == 'admin'){
            addAdmin({email: email});
        } else if(token == 'member'){
            addMember({email: email});
        } else if(token == null){
            removeToken({email: email});
            token = 'none'
        }
        document.querySelectorAll('.custom-claim-input' + doc.id).forEach(item => {
            if(item.hasAttribute(`set-as-${token}`)){
                item.checked = true;
            }
        })
        document.querySelectorAll('.custom-claim-label' + doc.id).forEach(item => {
            if(item.hasAttribute(`set-as-${token}-lab`)){
                item.classList.add('text-primary', 'font-weight-bold');
            } else {
                item.classList.remove('text-primary', 'font-weight-bold');
            }
        })            
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
    [document.querySelector('#allow-complete-task-adm'), document.querySelector('#allow-complete-task-mem'), document.querySelector('#allow-complete-task-ase'),
    document.querySelector('#allow-read-task-adm'), document.querySelector('#allow-read-task-mem'), document.querySelector('#allow-read-task-ase'),
    document.querySelector('#allow-edit-task-adm'), document.querySelector('#allow-edit-task-mem'), document.querySelector('#allow-edit-task-ase'),
    document.querySelector('#allow-delete-task-adm'), document.querySelector('#allow-delete-task-mem'), document.querySelector('#allow-delete-task-ase')].forEach((item, index) => {
        if(permission[index] == true){
            item.checked = true;
        } else {
            item.checked = false;
        }
    })
}

function renderTugas(doc){
    let releaseDate = doc.data().releaseDate;
    let assigneeName = doc.data().assigneeName;
    let assigneeUID = doc.data().assigneeUID;
    let taskComplete = doc.data().taskComplete;
    let description = doc.data().description;
    let dateDueExists = doc.data().dateDueExists;
    let dateDueBasis = doc.data().dateDueBasis;
    let dateDue = doc.data().dateDue;
    let late = doc.data().late;
    let completionDate = doc.data().completionDate;
    let dateDueInput = 0;
    let checked;
    let setDueDate;
    let notSetDueDate;
    if(dateDueExists){
        setDueDate = 'checked';
        switch(dateDueBasis){

        }
        if(dateDueWeek){
            dateDueWeek = 'selected';
            dateDueInput = (dateDue - releaseDate)/(7 * 24 * 60 * 60 * 1000)
        } else if(dateDueDay){
            dateDueDay = 'selected';
            dateDueInput = (dateDue - releaseDate)/(24 * 60 * 60 * 1000)
        } else if(dateDueHour){
            dateDueHour = 'selected';
            dateDueInput = (dateDue - releaseDate)/(60 * 60 * 1000)
        } else if(dateDueMinute){
            dateDueMinute = 'selected';
            dateDueInput = (dateDue - releaseDate)/(60 * 1000)
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
            completionDate = '-';
            break;
            case "COMPLETE":
            checked = 'checked';
            let hourCompletion = String(new Date(completionDate).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(completionDate).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(completionDate).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(completionDate).getMonth()];
            let yearCompletion = new Date(completionDate).getFullYear();        
            completionDate = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
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
            completionDate = '-';
            break;
            case "COMPLETE":
            status = "<div class='text-success font-italic'>has been completed</div>";
            checked = 'checked';
            let hourCompletion = String(new Date(completionDate).getHours()).padStart(2, '0');
            let minuteCompletion = String(new Date(completionDate).getMinutes()).padStart(2, '0');
            let dayCompletion = String(new Date(completionDate).getDate()).padStart(2, '0');
            let monthCompletion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthCompletion = monthCompletion[new Date(completionDate).getMonth()];
            let yearCompletion = new Date(completionDate).getFullYear();        
            completionDate = hourCompletion + ':' + minuteCompletion + ' / ' + dayCompletion + ' ' + monthCompletion + ' ' + yearCompletion;            
        }
        notSetDueDate = 'checked';
        dateDue = 'none';
    }
    let task = document.createElement('div');
    let modalInfo = document.createElement('div');
    let modalEdit = document.createElement('div');
    task.setAttribute('data-id', doc.id);
    let hourRelease = String(new Date(releaseDate).getHours()).padStart(2, '0');
    let minuteRelease = String(new Date(releaseDate).getMinutes()).padStart(2, '0');
    let dayRelease = String(new Date(releaseDate).getDate()).padStart(2, '0');
    let monthRelease = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthRelease = monthRelease[new Date(releaseDate).getMonth()];
    let yearRelease = new Date(releaseDate).getFullYear();
    releaseDate = hourRelease + ':' + minuteRelease + ' / ' + dayRelease + ' ' + monthRelease + ' ' + yearRelease;
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
                                    <td class="p-1">${releaseDate}</td>
                                </tr>              
                                <tr>
                                    <td class="p-1">Completion Date</td>
                                    <td class="p-1 text-center">:</td>
                                    <td class="p-1" id="tanggal-penyelesaian-tugas${doc.id}">${completionDate}</td>
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
                                        <i class="material-icons bg-danger rounded p-1 task-action text-white" id="delete${doc.id}">delete_forever</i>
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

function renderAuthToken(doc){
    let token = doc.data().token;
    auth.onAuthStateChanged(user => {
        user.getIdTokenResult().then(idTokenResultBef => {
            if((token == null && idTokenResultBef.claims.moderator == false && idTokenResultBef.claims.adminKantor == false && idTokenResultBef.claims.member == false) ||
               (token == 'admin' && idTokenResultBef.claims.adminKantor == true) ||
               (token == 'member' && idTokenResultBef.claims.member == true)){

            } else {
                let getNewIdToken = setInterval(getIdToken, 1000);
                function getIdToken(){
                    user.getIdToken(true).then(() => {
                        user.getIdTokenResult().then(idTokenResultAft => {
                            if((token == null && idTokenResultAft.claims.moderator == false && idTokenResultAft.claims.adminKantor == false && idTokenResultAft.claims.member == false) ||
                               (token == 'admin' && idTokenResultAft.claims.adminKantor == true) ||
                               (token == 'member' && idTokenResultAft.claims.member == true)){
                                clearInterval(getNewIdToken)
                                alert("There's a change on page views, page will be refresh");
                                window.location.reload();
                            }                        
                        })
                    })
                }
            }
        })
    })
}
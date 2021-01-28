const pendingTaskList = document.querySelector('[pending-task-list]');
const completedTaskList = document.querySelector('[completed-task-list]'); 
const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const authUserList = document.querySelector('[auth-user-list]');
const menuCategoryList = document.querySelector('[menu-category-list]')
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

        function sortByNumber(obj){
            let sort = obj.sort;
            let list = obj.list;
            let elements = obj.elements;
            let att = obj.att;
            Array.from(elements).sort(function(a, b){
                if(sort == 'asc'){
                    return a.getAttribute(`${att}`) - b.getAttribute(`${att}`);
                } else if(sort == 'des'){
                    return b.getAttribute(`${att}`) - a.getAttribute(`${att}`);                    
                }
            }).forEach(item => {
                list.prepend(item);
            })
        }

        function sortByPriority(obj){
            let sort = obj.sort;
            let list = obj.list;
            let elements = obj.elements;
            Array.from(elements).sort(function(a, b){
                if(sort == 'asc'){
                    return (a.getAttribute('data-priority') == 'high') - (b.getAttribute('data-priority') == 'high') || (a.getAttribute('data-priority') == 'moderate') - (b.getAttribute('data-priority') == 'moderate') || (a.getAttribute('data-priority') == 'low') - (b.getAttribute('data-priority') == 'low');
                } else if(sort == 'des'){
                    return (a.getAttribute('data-priority') == 'low') - (b.getAttribute('data-priority') == 'low') || (a.getAttribute('data-priority') == 'moderate') - (b.getAttribute('data-priority') == 'moderate') || (a.getAttribute('data-priority') == 'high') - (b.getAttribute('data-priority') == 'high');                    
                }
            }).forEach(item => {
                list.prepend(item);
            })            
        }

        if(user.emailVerified){
            user.getIdTokenResult().then(idTokenResult => {   

                document.querySelector('[user-name]').innerHTML = auth.currentUser.displayName;
                document.querySelector('[user-email]').innerHTML = auth.currentUser.email;

                if(idTokenResult.claims.moderator || idTokenResult.claims.adminKantor){
                    document.querySelectorAll('[add-row]').forEach(item => {
                        item.addEventListener('click', function(e){
                            e.stopPropagation();
                            document.querySelector(`[${this.getAttribute('clone-node-from')}]`).appendChild(document.querySelector(`[${this.getAttribute('clone-node-from')}]`).querySelector('tr').cloneNode(true))
                        })
                    })
                }

                if(idTokenResult.claims.moderator || idTokenResult.claims.adminKantor || idTokenResult.claims.member){
                    [document.querySelectorAll('[sort-by-string]'), document.querySelectorAll('[sort-by-number]')].forEach(queryItem => {
                        queryItem.forEach(item => {
                            item.addEventListener('click', function(e){
                                e.stopPropagation();
                                let list = this.closest('table').querySelector('tbody');
                                if(this.classList.contains('fa-caret-down')){
                                    this.classList.remove('fa-caret-down');
                                    this.classList.add('fa-caret-up');
                                    if(this.hasAttribute('sort-by-string')){
                                        sortByPriority({sort : 'asc', list : list, elements : document.querySelectorAll(`[${this.getAttribute('sort-tasks')}]`)})
                                    } else if(this.hasAttribute('sort-by-number')){
                                        sortByNumber({sort : 'asc', list : list, elements : document.querySelectorAll(`[${this.getAttribute('sort-tasks')}]`), att : this.getAttribute('data-sort')})
                                    } 
                                } else {
                                    this.classList.remove('fa-caret-up');
                                    this.classList.add('fa-caret-down');
                                    if(this.hasAttribute('sort-by-string')){
                                        sortByPriority({sort : 'des', list : list, elements : document.querySelectorAll(`[${this.getAttribute('sort-tasks')}]`)})
                                    } else if(this.hasAttribute('sort-by-number')){
                                        sortByNumber({sort : 'des', list : list, elements : document.querySelectorAll(`[${this.getAttribute('sort-tasks')}]`), att : this.getAttribute('data-sort')})
                                    }                                                                                                                 
                                }
                            })
                        })
                    })

                    document.querySelector('[user]').addEventListener('click', function(e){
                        e.stopPropagation();
                        document.querySelectorAll('[dropdown]').forEach(item => {
                            if(item.hasAttribute('user-information')){
                                item.classList.toggle('d-none');
                            } else {
                                item.classList.add('d-none')
                            }
                        })
                    })

                    document.querySelector('[sign-out]').addEventListener('click', function(e){
                        e.stopPropagation();
                        let confirmAlert = confirm('Apa anda yakin ingin keluar dari situs?');
                        if(confirmAlert){
                            auth.signOut();
                        }
                    })

                    document.querySelector('[menu-toggle]').addEventListener('click', function(e){
                        e.stopPropagation();
                        document.querySelectorAll('[dropdown]').forEach(item => {
                            if(item.hasAttribute('menu-identifier-list')){
                                item.classList.toggle('d-none');
                                if(item.classList.contains('d-none')){
                                    document.querySelector('[menu-icon-toggle]').classList.add('fa-caret-down');
                                    document.querySelector('[menu-icon-toggle]').classList.remove('fa-caret-up');
                                } else {
                                    document.querySelector('[menu-icon-toggle]').classList.remove('fa-caret-down');
                                    document.querySelector('[menu-icon-toggle]').classList.add('fa-caret-up');
                                }
                            } else {
                                item.classList.add('d-none');
                            }
                        })
                    })

                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.addEventListener('click', function() {
                            document.querySelector('[current-active-page]').innerHTML = `<span>${this.innerText}</span>`
                            document.querySelectorAll('.nav-link').forEach(item => {
                                item.classList.remove('active');
                            })
                        })
                    })

                    document.querySelectorAll('.tab-show-link').forEach(link => {
                        link.addEventListener('click', function(){
                            if(!this.classList.contains('text-primary')){
                                this.parentElement.querySelectorAll('.tab-show-link').forEach(item => {
                                    item.classList.toggle('text-primary');
                                })
                                document.querySelectorAll(`[${this.parentElement.getAttribute('data-target')}]`).forEach(item => {
                                    item.classList.toggle('d-none');
                                })
                            }
                        })
                    })

                    window.addEventListener('scroll', function(){
                        document.querySelectorAll('.nav-link').forEach(item => {
                            if(item.classList.contains('active')){
                                if(item.innerText != document.querySelector('[current-active-page]').innerText){
                                    document.querySelector('[current-active-page]').innerHTML = `<span>${item.innerText}</span>`
                                }
                            }
                        })                        
                        if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
                            document.querySelector('[current-active-page]').setAttribute('slide-to-show', true);                            
                            document.querySelector('[navbar]').classList.add('box-shadow', 'snow');
                            document.querySelector('[navbar]').classList.remove('bg-transparent');
                        } else {
                            document.querySelector('[current-active-page]').setAttribute('slide-to-show', false);   
                            document.querySelector('[navbar]').classList.add('bg-transparent');
                            document.querySelector('[navbar]').classList.remove('box-shadow', 'snow');
                        }
                    })

                    document.querySelector('[current-active-page]').addEventListener('click', function(){
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    })

                    document.querySelectorAll('[search-input]').forEach(item => {
                    // !! PROBLEM !! => IF THERE'S AN UPDATE ON ITS CONTENTS, WHAT SHOULD THIS FUNCTION DO? 
                        item.addEventListener('keyup', function(e){
                            let value = this.value;
                            let parentElMatch = false;
                            let parentEl = this.closest('[search-input-identifier]');

                            if(value.length == 0){
                                // IF CONDITION VALUE LENGTH EQUAL TO 0 START FROM HERE
                                parentEl.querySelectorAll('table').forEach(table => {// PREVENT FOR HAVING MORE THAN ONE TABLE IN PARENT
                                    if(!table.classList.contains('d-none')){
                                        table.querySelectorAll('tbody tr').forEach(tr => {
                                            tr.classList.remove('d-none');//PREVENTING FROM LINE BREAK DISAPPEARANCE 
                                            tr.querySelectorAll('td').forEach(td => {
                                                let childConditionMeet = false;// IF TRUE(ALLOW HIGHLIGHT INDEXOF OCCURENCE IN THIS ELEMENT INNERTEXT) WHEN TD CHILD LENGTH IS EQUAL 0 OR TD CHILD LENGTH IS GREATER THAN 0 AND ONLY CONTAIN SPAN AND BR ELEMENTS
                                                if(td.children.length == 0){
                                                    childConditionMeet = true;
                                                } else if(td.children.length > 0){
                                                    if(td.querySelectorAll('span').length + td.querySelectorAll('br').length == td.children.length){
                                                        childConditionMeet = true;
                                                    }
                                                }                    

                                                if(childConditionMeet){
                                                    let text = td.innerText;// GET THE ORIGINAL TEXT OF TD
                                                    td.innerHTML = text.replace(/\n\r?/g, '<br/>');//TD INNERHTML TO THE ORIGINAL TEXT
                                                }

                                            })
                                        })
                                    }
                                })
                                // IF CONDITION VALUE LENGTH EQUAL TO 0 END FROM HERE
                            } else {
                                // IF CONDITION VALUE LENGTH GREATER THAN 0 START FROM HERE
                                parentEl.querySelectorAll('table').forEach(table => {// PREVENT FOR HAVING MORE THAN ONE TABLE IN PARENT
                                    if(!table.classList.contains('d-none')){                                
                                        table.querySelectorAll('tbody tr').forEach(tr => {
                                            tr.classList.remove('d-none');// PREVENTING FROM LINE BREAK DISAPPEARANCE 
                                            let trConditionMeet = false;// IF TRUE(SHOW TR) WHEN INDEXOF OCCURRENCE IS MORE THAN 0                                     
                                            tr.querySelectorAll('td').forEach(td => {
                                                let childConditionMeet = false;// IF TRUE(ALLOW HIGHLIGHT INDEXOF OCCURENCE IN THIS ELEMENT INNERTEXT) WHEN TD CHILD LENGTH IS EQUAL 0 OR TD CHILD LENGTH IS GREATER THAN 0 AND ONLY CONTAIN SPAN AND BR ELEMENTS
                                                if(td.children.length == 0){
                                                    childConditionMeet = true;
                                                } else if(td.children.length > 0){
                                                    if(td.querySelectorAll('span').length + td.querySelectorAll('br').length == td.children.length){
                                                        childConditionMeet = true;
                                                    }
                                                }

                                                if(childConditionMeet){
                                                    let indices = [];                                     
                                                    let text = td.innerText;                                            
                                                    let index = text.toLowerCase().indexOf(value.toLowerCase());                   
                                                    while(index != -1){// WHILE LOOP START FROM HERE
                                                        indices.push(index);
                                                        index = text.toLowerCase().indexOf(value.toLowerCase(), index + 1);
                                                    }// WHILE LOOP END FROM HERE

                                                    if(indices.length > 0){
                                                        trConditionMeet = true;
                                                    }

                                                    let result = '';
                                                    let x = 0;      
                                                    while(x<indices.length){//WHILE LOOP START FROM HERE
                                                        if(indices.length > 1){// IF INDEXOF OCCURRENCE is MORE THAN 1
                                                            if(x == 0){// IF THIS IS THE FIRST LOOP OF INDEXOF OCCURRENCE                                                    
                                                                if(indices[x] == 0){// IF INDEXOF OCCURRENCE START FROM 0
                                                                    result += `<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>`;
                                                                } else {// IF INDEXOF OCCURRENCE NOT START FROM 0
                                                                    result += `${text.substring(0, indices[x])}<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>`;
                                                                }
                                                            } else if(x == indices.length - 1){// IF THIS IS THE LAST LOOP OF INDEXOF OCCURRENCE
                                                                if(indices[x] - 1 == indices[x - 1]){// IF THE PREVIOUS INDEXOF OCCURRENCE IS EQUAL TO CURRENT INDEXOF OCCURRENCE LESS 1
                                                                    result = result.slice(0, result.length - 7);// GET THE PREVIOUS RESULT WITHOUT SPAN END TAG(SPAN END TAG HAS 7 CHARACTERS LENGTH)
                                                                    result += `${text.substring(indices[x], indices[x] + value.length)}</span>${text.substring(indices[x] + value.length, text.length)}`;
                                                                } else if(indices[x] - 1 != indices[x - 1]){// IF THE PREVIOUS INDEXOF OCCURRENCE IS NOT EQUAL TO CURRENT INDEXOF OCCURRENCE LESS 1
                                                                    result += `${text.substring(indices[x - 1] + value.length, indices[x])}<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>${text.substring(indices[x] + value.length, text.length)}`
                                                                }                                                    
                                                            } else {// IF THIS NOT THE FIRST OR LAST LOOP OF INDEXOF OCCURRENCE
                                                                if(indices[x] - 1 == indices[x - 1]){// IF THE PREVIOUS INDEXOF OCCURRENCE IS EQUAL TO CURRENT INDEXOF OCCURRENCE LESS 1
                                                                    result = result.slice(0, result.length - 7);// GET THE PREVIOUS RESULT WITHOUT SPAN END TAG(SPAN END TAG HAS 7 CHARACTERS LENGTH)
                                                                    result += `${text.substring(indices[x], indices[x] + value.length)}</span>`;
                                                                } else if(indices[x] - 1 != indices[x - 1]){// IF THE PREVIOUS INDEXOF OCCURRENCE IS NOT EQUAL TO CURRENT INDEXOF OCCURRENCE LESS 1
                                                                    result += `${text.substring(indices[x - 1] + value.length, indices[x])}<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>`
                                                                }
                                                            }
                                                        } else if(indices.length == 1){// IF INDEXOF OCCURRENCE is EQUAL TO 1
                                                            if(indices[x] == 0){// IF INDEXOF OCCURRENCE START FROM 0
                                                                result += `<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>${text.substring(indices[x] + value.length, text.length)}`;
                                                            } else if(indices[x] != 0){// IF INDEXOF OCCURRENCE NOT START FROM 0
                                                                result += `${text.substring(0, indices[x])}<span class="highlight">${text.substring(indices[x], indices[x] + value.length)}</span>${text.substring(indices[x] + value.length, text.length)}`;                                                      
                                                            }                                                    
                                                        }
                                                        x++;                                                
                                                    }//WHILE LOOP END FROM HERE
                                                    if(result.length == 0){// PREVENT TD FROM INNERHTML A NULL VALUE
                                                        result = text;
                                                    }
                                                    td.innerHTML = result.replace(/\n\r?/g, '<br/>');                                                                                                                              
                                                }
                                            })
                                            if(trConditionMeet){
                                                tr.classList.remove('d-none');
                                            } else {                                                
                                                tr.classList.add('d-none');
                                            }
                                        })
                                    }
                                })
                                // IF CONDITION VALUE LENGTH GREATER THAN 0 END FROM HERE
                            }
                        })
                    })

                }


                if(idTokenResult.claims.moderator){
                    const addUser = document.querySelector('#add-user');
                    addUser.addEventListener('submit', function(e){
                        e.preventDefault();
                        let name = addUser['name'].value;
                        let email = addUser['email'].value;
                        let password = addUser['password'].value;
                        let addAuthUser = functions.httpsCallable('addAuthUser');
                        addAuthUser({displayName: name, email: email, password: password}).then((changes) => {
                            if(changes.data.uid == null){
                                alert(changes.data.message)
                            } else {
                                db.collection('users').doc(changes.data.uid).collection('obj').doc('property').set({
                                    email : email
                                }).then(() => {
                                    db.collection('users').doc(changes.data.uid).set({
                                        name : name
                                    }).then(() => {
                                        alert(changes.data.message)
                                    })
                                })
                            }
                            
                        })
                    })

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
                                    alert('Request have already been sent before')
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
                    alert("Your email have been verified! You'll be signed out of sites");
                    auth.signOut();
                } else {
                    alert("Your email haven't been verified!");
                }
            });

            document.querySelector('#resend-verification-email').addEventListener('click', function(){
                auth.currentUser.sendEmailVerification().then(() => {
                    alert('Verification email have been sent!')
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

function renderUserMod(doc){
    db.collection('users').doc(doc.id).collection('obj').doc('property').get().then(secDoc => {
        let name = doc.data().name;
        let token = doc.data().token;
        let email = secDoc.data().email;
        let tr = document.createElement('tr');
        let option = document.createElement('option');
        option.setAttribute('uid', doc.id);
        tr.classList.add('border-bottom');
        tr.setAttribute('data-id', doc.id);
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
        <td class="text-center align-middle auth-user-data fs-1">${email}</td>
        <td class="text-center align-middle auth-user-data fs-1">${name}</td>
        <td class="text-center align-middle fs-1">
            <div class="d-flex justify-content-center">       
                <div class="d-flex align-items-center mr-2">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input" set-as-admin ${inputAdmin}>
                    <div class="custom-claim-label${inputAdminLabel}" set-as-admin-lab>Admin</div>
                </div>
                <div class="d-flex align-items-center mr-2">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input" set-as-member ${inputMember}>
                    <div class="custom-claim-label${inputMemberLabel}" set-as-member-lab>Member</div>
                </div>
                <div class="d-flex align-items-center">
                    <input type="radio" name="${doc.id}" class="mr-1 custom-claim-input" set-as-none ${inputNone}>
                    <div class="custom-claim-label${inputNoneLabel}" set-as-none-lab>None</div>
                </div>                
            </div>            
        </td>
        <td class="text-center align-middle auth-user-data fs-1">${doc.id}</td>
        <td class="text-center align-middle fs-1"><i class="btn btn-danger fa fa-user-times" auth-delete-user></i></td>
        `
        option.innerHTML = name;

        authUserList.appendChild(tr)

        addTask['assign-task-to'].appendChild(option);
        Array.from(addTask['assign-task-to'].querySelectorAll('option')).sort(function(a, b){
            if(a.innerHTML < b.innerHTML) { return 1; }
            if(a.innerHTML > b.innerHTML) { return -1; }
            return 0;         
        }).forEach(item => {
            addTask['assign-task-to'].prepend(item);
        })  

        document.querySelectorAll('[data-id="' + doc.id + '"] .custom-claim-input').forEach(input => {
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

        document.querySelector('[data-id="' + doc.id + '"] [auth-delete-user]').addEventListener('click', function(){
            let confirmAlert = confirm('Apa anda yakin ingin menghapus data user ini?')
            if(confirmAlert){
                let deleteUser = functions.httpsCallable('deleteUser');
                deleteUser({ uid: doc.id }).then((changes) => {
                    if(changes.data.userDeleted == true){
                        db.collection('users').doc(doc.id).delete();
                        db.collection('users').doc(doc.id).collection('obj').doc('property').delete();
                        alert(changes.data.message)
                    } else {
                        alert(changes.data.message)
                    }
                })
            }
        })


    })
}

function renderUserAdm(doc){
    let name = doc.data().name;
    let option = document.createElement('option');
    option.setAttribute('uid', doc.id);
    option.innerHTML = name;
    addTask['assign-task-to'].appendChild(option);
    Array.from(addTask['assign-task-to'].querySelectorAll('option')).sort(function(a, b){
        if(a.innerHTML < b.innerHTML) { return 1; }
        if(a.innerHTML > b.innerHTML) { return -1; }
        return 0;         
    }).forEach(item => {
        addTask['assign-task-to'].prepend(item);
    })  
}

function renderUpdateUser(doc){
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
        document.querySelectorAll('[data-id="' + doc.id + '"] .custom-claim-input').forEach(item => {
            if(item.hasAttribute(`set-as-${token}`)){
                item.checked = true;
            }
        })
        document.querySelectorAll('[data-id="' + doc.id + '"] .custom-claim-label').forEach(item => {
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

function renderTask(doc){
    let tr = document.createElement('tr');
    let modal = document.createElement('div');    
    let complete = doc.data().complete;
    let assignedTo = doc.data().assignedTo;
    let taskPriority = doc.data().taskPriority;
    let description = doc.data().description;
    let taskmaster = doc.data().taskmaster;
    let dueWeek = doc.data().dueWeek;
    let dueDay = doc.data().dueDay;
    let dueHour = doc.data().dueHour;
    let dueMinute = doc.data().dueMinute;
    let availableSince = doc.data().availableSince;
    let completionTime = doc.data().completionTime;
    let dueTime = (availableSince + (dueWeek * 7 * 24 * 60 * 60 * 1000) + (dueDay * 24 * 60 * 60 * 1000) + (dueHour * 60 * 60 * 1000) + (dueMinute * 60 * 1000));
    tr.setAttribute('available-time', availableSince);
    tr.setAttribute('due-time', dueTime);   
    tr.setAttribute('data-priority', taskPriority.toLowerCase());
    let hourAS = String(new Date(availableSince).getHours()).padStart(2, '0');
    let minuteAS = String(new Date(availableSince).getMinutes()).padStart(2, '0');
    let dateAS = String(new Date(availableSince).getDate()).padStart(2, '0');
    let monthAS = month[new Date(availableSince).getMonth()];
    let yearAS = new Date(availableSince).getFullYear();
    availableSince = dateAS + ' ' + monthAS + ' ' + yearAS + ' ' + hourAS + ':' + minuteAS;
    let hourDT = String(new Date(dueTime).getHours()).padStart(2, '0');
    let minuteDT = String(new Date(dueTime).getMinutes()).padStart(2, '0');
    let dateDT = String(new Date(dueTime).getDate()).padStart(2, '0');
    let monthDT = month[new Date(dueTime).getMonth()];
    let yearDT = new Date(dueTime).getFullYear();
    dueTime = dateDT + ' ' + monthDT + ' ' + yearDT + ' ' + hourDT + ':' + minuteDT;
    let taskPriorityHigh;
    let taskPriorityModerate;
    let taskPriorityLow;
    if(complete){
        tr.setAttribute('task-complete', '');
        tr.setAttribute('completion-time', completionTime);
        complete = 'checked';
        let hourCT = String(new Date(completionTime).getHours()).padStart(2, '0');
        let minuteCT = String(new Date(completionTime).getMinutes()).padStart(2, '0');
        let dateCT = String(new Date(completionTime).getDate()).padStart(2, '0');
        let monthCT = month[new Date(completionTime).getMonth()];
        let yearCT = new Date(completionTime).getFullYear();
        completionTime = dateCT + ' ' + monthCT + ' ' + yearCT + ' ' + hourCT + ':' + minuteCT;
        completionTime = `<td class="fs-1 align-middle text-center" task-completionTime>${completionTime}</td>`;        
    } else {
        tr.setAttribute('task-incomplete', '')
        complete = '';
        completionTime = '';
    }    
    switch(taskPriority){
        case "High":
        taskPriorityHigh = 'selected';
        break;
        case "Moderate":
        taskPriorityModerate = 'selected';
        break;
        case "Low":
        taskPriorityLow = 'selected';
    }
    tr.setAttribute('data-id', doc.id);
    tr.classList.add('border-bottom');
    tr.innerHTML = `
    <td class="fs-1 align-middle text-center" task-availableSince>${availableSince}</td>
    <td class="fs-1 align-middle text-center font-weight-bold" task-assignedTo>${assignedTo}</td>
    <td class="fs-1 align-middle text-left" task-description>${description}</td>    
    <td class="fs-1 align-middle text-center font-weight-bold priority-${taskPriority.toLowerCase()}" task-priority>${taskPriority}</td>
    ${completionTime}
    <td class="fs-1 align-middle text-center" task-dueTime>${dueTime}</td>
    <td class="align-middle text-center"><input type="checkbox" class="m-1" task-status ${complete}></td>    
    <td class="fs-1 align-middle text-center position-relative" task-action>
        <i class="material-icons" task-action-button role="button">more_vert</i>
        <div class="position-absolute rounded bg-white zi-1 border d-none top-0" dropdown>
            <div class="btn p-1 fs-1" data-toggle="modal" data-target="#edit-task-modal${doc.id}" role="button">Edit tugas</div>
            <div class="btn p-1 fs-1" delete-task role="button">Hapus tugas</div>
        </div>
    </td>
    `

    modal.innerHTML = `
    <div class="modal fade" id="edit-task-modal${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Tugas</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">        
                        <div class="form-group">
                            <label>Description</label>
                            <textarea oninput="auto_grow(this)" name="task-description" class="form-control">${description.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Task Priority</label>
                            <select class="form-control" name="task-priority">
                                <option ${taskPriorityHigh}>High</option>
                                <option ${taskPriorityModerate}>Moderate</option>
                                <option ${taskPriorityLow}>Low</option>
                            </select>
                        </div>           
                        <div class="form-group">
                            <label>Task Due Time</label>        
                            <div class="row">
                                <div class="input-group mb-2 mr-2 pr-0 col-6">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Week</div>
                                    </div>
                                    <input type="number" class="form-control" value="${dueWeek}" name="task-due-week">
                                </div>
                                <div class="input-group mb-2 pl-0 col">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text px-4">Day</div>
                                    </div>
                                    <input type="number" class="form-control" value="${dueDay}" name="task-due-day">
                                </div>                                                                                  
                            </div>
                            <div class="row"> 
                                <div class="input-group mb-2 mr-2 pr-0 col-6">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text pr-3">Hour</div>
                                    </div>
                                    <input type="number" class="form-control" value="${dueHour}" name="task-due-hour">
                                </div>    
                                <div class="input-group mb-2 pl-0 col">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Minute</div>
                                    </div>
                                    <input type="number" class="form-control" value="${dueMinute}" name="task-due-minute">
                                </div>                                                                                
                            </div>
                            <div task-due-time></div>
                        </div>
                    </div>                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `

    if(complete){
        completedTaskList.append(tr);
    } else {
        pendingTaskList.prepend(tr);
    }

    document.body.appendChild(modal);

    document.querySelector('[data-id="' + doc.id + '"] [task-action-button').addEventListener('click', function(e){
        e.stopPropagation();
        document.querySelectorAll('[dropdown]').forEach(item => {
            if(item.parentElement.parentElement.getAttribute('data-id') != doc.id){
                item.classList.add('d-none');
            }
        })
        document.querySelector('[data-id="' + doc.id + '"] [dropdown]').classList.toggle('d-none');        
        let elPosition = this.getBoundingClientRect();
        let elParentPosition = this.parentElement.getBoundingClientRect();
        document.querySelector('[data-id="' + doc.id + '"] [dropdown]').style.right = (elParentPosition.width - elPosition.width) + 'px';
        document.querySelector('[data-id="' + doc.id + '"] [dropdown]').style.top = (elParentPosition.height - document.querySelector('[data-id="' + doc.id + '"] [dropdown]').getBoundingClientRect().height)/2 + 'px';
    })

    document.querySelector('[data-id="' + doc.id + '"] [delete-task]').addEventListener('click', function(e){
        e.stopPropagation();
        let confirmAlert = confirm(`Apa anda yakin ingin menghapus tugas ini?`)
        if(confirmAlert){
            db.collection('tasks').doc(doc.id).delete().then(() => {
                alert(`Tugas telah dihapus!`);
            })
        }
    })

    document.querySelector(`#edit-task-modal${doc.id} form`).addEventListener('submit', function(e){
        e.preventDefault();
        db.collection('tasks').doc(doc.id).update({
            description : this['task-description'].value.replace(/\n\r?/g, '<br/>'),
            taskPriority : this['task-priority'].value,
            dueWeek : this['task-due-week'].value,
            dueDay : this['task-due-day'].value,
            dueHour : this['task-due-hour'].value,
            dueMinute : this['task-due-minute'].value
        }).then(() => {
            alert(`${assignedTo}'s task have been updated!`);
        })
    })

    document.querySelector('[data-id="' + doc.id + '"] [task-status]').addEventListener('change', function(){
        if(this.checked){
            db.collection('tasks').doc(doc.id).update({
                complete : true,
                completionTime : new Date().getTime()
            }).then(() => {
                alert('Task have been completed');
            })
        } else {
            db.collection('tasks').doc(doc.id).update({
                complete : false,
                completionTime : firebase.firestore.FieldValue.delete()
            }).then(() => {
                alert(`${assignedTo}'s task completion has been canceled`);
            })
        }
    })

}   

function renderUpdateTask(doc){
    let complete = doc.data().complete;
    let assignedTo = doc.data().assignedTo;
    let taskPriority = doc.data().taskPriority;
    let description = doc.data().description;
    let taskmaster = doc.data().taskmaster;
    let dueWeek = doc.data().dueWeek;
    let dueDay = doc.data().dueDay;
    let dueHour = doc.data().dueHour;
    let dueMinute = doc.data().dueMinute;
    let availableSince = doc.data().availableSince;
    let completionTime = doc.data().completionTime;
    let dueTime = (availableSince + (dueWeek * 7 * 24 * 60 * 60 * 1000) + (dueDay * 24 * 60 * 60 * 1000) + (dueHour * 60 * 60 * 1000) + (dueMinute * 60 * 1000));
    document.querySelector('[data-id="' + doc.id + '"]').setAttribute('available-time', availableSince);
    document.querySelector('[data-id="' + doc.id + '"]').setAttribute('due-time', dueTime);
    document.querySelector('[data-id="' + doc.id + '"]').setAttribute('data-priority', taskPriority.toLowerCase());
    let hourAS = String(new Date(availableSince).getHours()).padStart(2, '0');
    let minuteAS = String(new Date(availableSince).getMinutes()).padStart(2, '0');
    let dateAS = String(new Date(availableSince).getDate()).padStart(2, '0');
    let monthAS = month[new Date(availableSince).getMonth()];
    let yearAS = new Date(availableSince).getFullYear();
    availableSince = dateAS + ' ' + monthAS + ' ' + yearAS + ' ' + hourAS + ':' + minuteAS;
    let hourDT = String(new Date(dueTime).getHours()).padStart(2, '0');
    let minuteDT = String(new Date(dueTime).getMinutes()).padStart(2, '0');
    let dateDT = String(new Date(dueTime).getDate()).padStart(2, '0');
    let monthDT = month[new Date(dueTime).getMonth()];
    let yearDT = new Date(dueTime).getFullYear();
    dueTime = dateDT + ' ' + monthDT + ' ' + yearDT + ' ' + hourDT + ':' + minuteDT;
    if(completionTime == null){
        completionTime = '-'
        if(document.querySelector('[data-id="' + doc.id + '"] [task-completionTime]')){
            document.querySelector('[data-id="' + doc.id + '"]').removeAttribute('completion-time');
            document.querySelector('[data-id="' + doc.id + '"] [task-completionTime]').remove();
        }
    } else {
        if(!document.querySelector('[data-id="' + doc.id + '"] [task-completionTime]')){
            document.querySelector('[data-id="' + doc.id + '"]').setAttribute('completion-time', completionTime);
            let hourCT = String(new Date(completionTime).getHours()).padStart(2, '0');
            let minuteCT = String(new Date(completionTime).getMinutes()).padStart(2, '0');
            let dateCT = String(new Date(completionTime).getDate()).padStart(2, '0');
            let monthCT = month[new Date(completionTime).getMonth()];
            let yearCT = new Date(completionTime).getFullYear();
            completionTime = dateCT + ' ' + monthCT + ' ' + yearCT + ' ' + hourCT + ':' + minuteCT;            
            let td = document.createElement('td');
            td.classList.add('fs-1', 'align-middle', 'text-center');
            td.setAttribute('task-completionTime', '');
            td.innerHTML = completionTime;       
            document.querySelector('[data-id="' + doc.id + '"]').insertBefore(td, document.querySelector('[data-id="' + doc.id + '"] [task-priority]').nextSibling); 
        }
    }
    if(complete){
        if(document.querySelector('[data-id="' + doc.id + '"]').hasAttribute('task-incomplete')){
            document.querySelector('[data-id="' + doc.id + '"]').setAttribute('task-complete', '');
            document.querySelector('[data-id="' + doc.id + '"]').removeAttribute('task-incomplete');
            completedTaskList.append(document.querySelector('[data-id="' + doc.id + '"]'));
        }
    } else {
        if(document.querySelector('[data-id="' + doc.id + '"]').hasAttribute('task-complete')){
            document.querySelector('[data-id="' + doc.id + '"]').setAttribute('task-incomplete', '');
            document.querySelector('[data-id="' + doc.id + '"]').removeAttribute('task-complete');
            pendingTaskList.prepend(document.querySelector('[data-id="' + doc.id + '"]'));
        }
    }      
    document.querySelector('[data-id="' + doc.id + '"] [task-status]').checked = complete;
    document.querySelector('[data-id="' + doc.id + '"] [task-assignedTo]').innerHTML = assignedTo;
    ['priority-low', 'priority-moderate', 'priority-high'].forEach(item => {
        if(document.querySelector('[data-id="' + doc.id + '"] [task-priority]').classList.contains(item)){
            document.querySelector('[data-id="' + doc.id + '"] [task-priority]').classList.remove(item);
        }
    })
    document.querySelector('[data-id="' + doc.id + '"] [task-priority]').classList.add(`priority-${taskPriority.toLowerCase()}`);
    document.querySelector('[data-id="' + doc.id + '"] [task-priority]').innerHTML = taskPriority;
    document.querySelector('[data-id="' + doc.id + '"] [task-description]').innerHTML = description;
    document.querySelector('[data-id="' + doc.id + '"] [task-availableSince]').innerHTML = availableSince;
    document.querySelector('[data-id="' + doc.id + '"] [task-dueTime]').innerHTML = dueTime;
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-description'].value = description.replace(/<br\s*[\/]?>/gi, "\n");
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-priority'].querySelectorAll('option').forEach((item, index) => {
        if(item.innerHTML == taskPriority){
            document.querySelector(`#edit-task-modal${doc.id} form`)['task-priority'].selectedIndex = index;
        }
    })
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-due-week'].value = dueWeek;
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-due-day'].value = dueDay;
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-due-hour'].value = dueHour;
    document.querySelector(`#edit-task-modal${doc.id} form`)['task-due-minute'].value = dueMinute;
}

let goodsTransportIndicatorList = document.querySelector('[goods-transport-indicator-list]');
let goodsTransportList = document.querySelector('[goods-transport-list]');
function renderGoodsTransport(doc){  
    let indicator = document.createElement('div');
    let content = document.createElement('div');
    let history = document.createElement('div');
    let edit = document.createElement('div');
    let goodsTransportDate = doc.data().goodsTransportDate;
    let dateValue = goodsTransportDate;
    indicator.setAttribute('goods-transport-date', goodsTransportDate)    
    let description = doc.data().description;
    let dateGT = String(new Date(goodsTransportDate).getDate()).padStart(2, '0');
    let monthGT = month[new Date(goodsTransportDate).getMonth()];
    let yearGT = new Date(goodsTransportDate).getFullYear();
    goodsTransportDate = dateGT + ' ' + monthGT + ' ' + yearGT;
    indicator.setAttribute('data-id', doc.id);
    indicator.setAttribute('goods-transport-indicator', '');
    indicator.classList.add('py-1', 'pr-2', 'pl-4', 'fs-2', 'text-secondary', 'font-weight-500')
    indicator.setAttribute('role', 'button');
    indicator.innerHTML = goodsTransportDate;
    content.setAttribute('data-id', doc.id);
    content.setAttribute('goods-transport-content', '');
    content.classList.add('fs-2', 'mb-4', 'position-relative', 'h-100', 'd-none')
    content.innerHTML = `
    <div class="p-2 w-100 bg-light font-weight-bold border-bottom d-flex align-items-center">
        <i class="fa fa-archive mx-1 text-secondary"></i>
        <span class="text-secondary">Perpindahan ${goodsTransportDate}</span>
        <i class="material-icons ml-auto fs-5 mr-1 text-dark" copy-goods-transport-description role="button">content_copy</i>
    </div>
    <div class="p-2" goods-transport-description>${description}</div>
    `;
    history.innerHTML = `
    <div class="modal fade" id="update-history-modal${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fa fa-history"></i>
                        <span>Update history</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">        

                </div>                    
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </div>
    </div>
    `
    edit.innerHTML = `
    <div class="modal fade" id="edit-goods-transport-modal${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Perpindahan</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Tanggal</label>
                            <input type="date" name="goods-transport-date" class="form-control" value="${dateValue}" required>
                        </div>                            
                        <div class="form-group">
                            <label>Description</label>
                            <textarea oninput="auto_grow(this)" name="goods-transport-description" class="form-control" required>${description.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                        </div>
                    </div>                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
    goodsTransportIndicatorList.appendChild(indicator);
    goodsTransportList.appendChild(content);
    document.body.appendChild(history);
    document.body.appendChild(edit);

    document.querySelector('[data-id="' + doc.id + '"][goods-transport-indicator]').addEventListener('click', function(e){
        e.stopPropagation();
        document.querySelectorAll('[goods-transport-indicator]').forEach(indicator => {
            if(indicator.getAttribute('data-id') == doc.id){
                indicator.classList.add('lightgrey');
            } else {
                indicator.classList.remove('lightgrey');
            }
        })        
        document.querySelectorAll('[goods-transport-content]').forEach(content => {
            if(content.getAttribute('data-id') == doc.id){
                content.classList.remove('d-none');
            } else {
                content.classList.add('d-none');
            }      
        })
    })

    document.querySelector('[data-id="' + doc.id + '"] [copy-goods-transport-description]').addEventListener('click', function(e){
        e.stopPropagation();
        let range = document.getSelection().getRangeAt(0);
        range.selectNode(document.querySelector('[data-id="' + doc.id + '"] [goods-transport-description]'));
        window.getSelection().addRange(range);
        document.execCommand("copy");        
    })

    document.querySelector(`#edit-goods-transport-modal${doc.id} form`).addEventListener('submit', function(e){
        e.preventDefault();
        db.collection('tasks').doc(doc.id).update({
            description : this['task-description'].value.replace(/\n\r?/g, '<br/>'),
            taskPriority : this['task-priority'].value,
            dueWeek : this['task-due-week'].value,
            dueDay : this['task-due-day'].value,
            dueHour : this['task-due-hour'].value,
            dueMinute : this['task-due-minute'].value
        }).then(() => {
            alert(`${assignedTo}'s task have been updated!`);
        })
    })

    Array.from(document.querySelectorAll('[goods-transport-indicator]')).sort(function(a, b){
        if(a.getAttribute('goods-transport-date') < b.getAttribute('goods-transport-date')) { return 1; }
        if(a.getAttribute('goods-transport-date') > b.getAttribute('goods-transport-date')) { return -1; }
        return 0;         
    }).forEach(item => {
        goodsTransportIndicatorList.prepend(item);
    })  

/*    document.querySelector('[data-id="' + doc.id + '"] [delete-goods-transport]').addEventListener('click', function(){
        let confirmAlert = confirm('Apa anda yakin ingin menghapus data perpindahan ini');
        if(confirmAlert){
            db.collection('goodsTransport').doc(doc.id).delete().then(() => {
                alert('Data perpindahan telah dihapus!')
            })   
        }   
    })*/        

}

function renderUpdateGoodsTransport(doc){

}

function renderMenuCategory(doc){
    let div = document.createElement('div');
    let editMenuCategory = document.createElement('div');
    let addMenu = document.createElement('div');
    let dateCreate = doc.data().dateCreate;
    let name = doc.data().name;
    div.setAttribute('data-id', doc.id);
    div.setAttribute('data-date-create', dateCreate);
    div.setAttribute('menu-category', '')
    div.classList.add('ml-2', 'p-2');
    div.innerHTML = `
    <div class="font-weight-500 text-nowrap d-flex">
        <span>${name}</span>
        <i class="material-icons fs-4 p-1" role="button" data-toggle="modal" data-target="#edit-menu-category-modal${doc.id}">insert_link</i>
    </div>
    <ul menu-list class="list-unstyled mb-1"></ul>
    <div role="button" class="d-flex fs-2 text-primary text-nowrap font-weight-500" data-toggle="modal" data-target="#add-menu-modal${doc.id}">
      <span>Tambah menu</span>
    </div>
    `;

    addMenu.innerHTML = `
    <div class="modal fade" id="add-menu-modal${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah menu</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nama menu</label>
                            <input type="text" name="menu-name" class="form-control" required>
                        </div>                            
                        <div class="form-group">
                            <label>Link tujuan</label>
                            <input type="text" name="menu-link" class="form-control" required>
                        </div>
                    </div>                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `

    editMenuCategory.innerHTML = `
    <div class="modal fade" id="edit-menu-category-modal${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title">Informasi Kategori Menu</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nama menu</label>
                            <input type="text" name="menu-name" class="form-control" value="${name}" required>
                        </div>                            
                    </div>                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `

    menuCategoryList.appendChild(div);
    document.body.appendChild(addMenu);
    document.body.appendChild(editMenuCategory);

    Array.from(document.querySelectorAll('[menu-category]')).sort(function(a, b){
        if(a.getAttribute('data-date-create') < b.getAttribute('data-date-create')) { return 1; }
        if(a.getAttribute('data-date-create') > b.getAttribute('data-date-create')) { return -1; }
        return 0;         
    }).forEach(item => {
        menuCategoryList.prepend(item);
    })

    document.querySelector(`#add-menu-modal${doc.id} form`).addEventListener('submit', function(e){
        e.preventDefault();
        db.collection('menuCategory').doc(doc.id).collection('menu').add({
            dateCreate : new Date().getTime(),
            name : this['menu-name'].value,
            link : this['menu-link'].value
        }).then(() => {
            alert('Menu berhasil ditambahkan!')
            this.reset();
        })
    })

}

function renderUpdateMenuCategory(doc){

}

function renderMenu(doc, menuCategoryDoc){
    let li = document.createElement('li');
    let dateCreate = doc.data().dateCreate;
    let name = doc.data().name;
    let link = doc.data().link;
    li.setAttribute('data-id', doc.id);
    li.setAttribute('data-date-create', dateCreate);
    li.classList.add('text-decoration-none');
    li.innerHTML = `
    <a href="${link}" target="_blank" class="text-decoration-none text-secondary fs-2 font-weight-500 text-nowrap" add-menu>${name}</a>
    `;
    document.querySelector(`[data-id=${menuCategoryDoc.id}] [menu-list]`).appendChild(li);

    Array.from(document.querySelectorAll(`[data-id=${menuCategoryDoc.id}] [menu-list] li`)).sort(function(a, b){
        if(a.getAttribute('data-date-create') < b.getAttribute('data-date-create')) { return 1; }
        if(a.getAttribute('data-date-create') > b.getAttribute('data-date-create')) { return -1; }
        return 0;         
    }).forEach(item => {
        document.querySelector(`[data-id=${menuCategoryDoc.id}] [menu-list]`).prepend(item);
    })    
}

function renderUpdateMenu(doc, menuCategoryDoc){

}

function renderOtherMenu(doc){
    let li = document.createElement('li');
    let dateCreate = doc.data().dateCreate;
    let name = doc.data().name;
    let link = doc.data().link;
    li.setAttribute('data-id', doc.id);
    li.setAttribute('data-date-create', dateCreate);
    li.classList.add('text-decoration-none');
    li.innerHTML = `
    <a href="${link}" target="_blank" class="text-decoration-none text-secondary fs-2 font-weight-500 text-nowrap" add-menu>${name}</a>
    `;
    document.querySelector(`[other-menu-list]`).appendChild(li);

    Array.from(document.querySelectorAll(`[other-menu-list] li`)).sort(function(a, b){
        if(a.getAttribute('data-date-create') < b.getAttribute('data-date-create')) { return 1; }
        if(a.getAttribute('data-date-create') > b.getAttribute('data-date-create')) { return -1; }
        return 0;         
    }).forEach(item => {
        document.querySelector(`[other-menu-list]`).prepend(item);
    })

}

function renderUpdateOtherMenu(doc){

}

function auto_grow(element){
    element.style.height = (element.scrollHeight)+"px";
}

function set_input_date_now(element, date){
    let input = document.querySelector(`${element.getAttribute('data-target')} form input[type=date]`)
    input.value = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString().padStart(2, 0) + '-' + new Date().getDate().toString().padStart(2, 0);
}
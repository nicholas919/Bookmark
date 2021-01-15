auth.onAuthStateChanged(user => {
  if(user){
  	user.getIdTokenResult().then(idTokenResult => {
  		if(idTokenResult.claims.moderator){
		    db.collection('users').onSnapshot(snapshot =>{
		        let changes = snapshot.docChanges();
		        changes.forEach(change =>{
				    if(change.type == 'added'){
					    if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					        renderPengguna(change.doc);
					    }
				    } else if (change.type == 'modified'){
				        renderUpdatePengguna(change.doc);
				    }
		        })
		    })
		} else if(idTokenResult.claims.adminKantor){
		    db.collection('users').onSnapshot(snapshot =>{
		        let changes = snapshot.docChanges();
		        changes.forEach(change =>{
				    if(change.type == 'added'){
					    if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					        renderPengguna(change.doc);
					    }
				    } else if (change.type == 'modified'){
				        renderUpdatePengguna(change.doc);
				    }
		        })
		    })			
		} else {
		    db.collection('users').doc(auth.currentUser.uid).onSnapshot({
		    	includeMetadataChanges : true
		    }, function(doc){
		    	renderAuthToken(doc);
		    })			
		}

/*
    db.collection('aktivitasKalender').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
	                renderAktivitasKalender(change.doc);
		            let items = $('#list-aktivitas-kalender > .aktivitas-kalender').get();
		            items.sort(function(a, b) {
		                let keyA = $(a).data('date');
		                let keyB = $(b).data('date');
		                if (keyA > keyB) return 1;
		                if (keyA < keyB) return -1;
		                return 0;
		            })
		            let list = $('#list-aktivitas-kalender');
		            $.each(items, function(i, div){
		            	list.append(div);
		            })                
                }
            } else if (change.type == 'removed'){
                document.querySelectorAll('[data-id="' + change.doc.id + '"]').forEach(item => {
                	item.remove();
                })
            } else if (change.type == 'modified'){
            	renderUpdateAktivitasKalender(change.doc);
		        let items = $('#list-aktivitas-kalender > .aktivitas-kalender').get();
		        items.sort(function(a, b) {
		            let keyA = $(a).data('date');
		            let keyB = $(b).data('date');
		            if (keyA > keyB) return 1;
		            if (keyA < keyB) return -1;
		            return 0;
		        })
		        let list = $('#list-aktivitas-kalender');
		        $.each(items, function(i, div){
		        	console.log(div);
		           	list.append(div);
		        })               	
            }
        })
    }, err => {
		firebaseError(err);
	})	
*/
  		setupUI(user);
  	})  		
  } else {
  	setupUI();
  }
})

const addTask = document.querySelector('#add-task');
addTask.addEventListener('submit', function(e){
	e.preventDefault();
	let releaseDate = new Date().getTime();
	let dueDateExists;
	let dueDateBasis;
	let dueDate;
	document.querySelectorAll('.due-date-control').forEach(item => {
		if(item.checked){
			if(item.hasAttribute('set-due-date')){
				dueDateExists = true;
				if(this['due-date-basis'].value == '-' || this['due-date-input'].value == 0){
					return alert('You may need to fill due date of task if you want to set due date on it');
				} else {
					dueDateBasis = this['due-date-basis'].value;
					switch(dueDateBasis){
						case "Week":
						dueDate = releaseDate + (this['due-date-input'].value/(7*24*60*60*1000));
						break;
						case "Day":
						dueDate = releaseDate + (this['due-date-input'].value/(24*60*60*1000));
						break;
						case "Hour":
						dueDate = releaseDate + (this['due-date-input'].value/(60*60*1000));
						break;
						case "Minute":
						dueDate = releaseDate + (this['due-date-input'].value/(60*1000));
					}
				}
			} else if(item.hasAttribute('not-set-due-date')){
				dueDateExists = false;
				dueDateBasis = null;
				dueDate = null;
			}
		}
	})
	db.collection('tugass').add({
		assignorUID : auth.currentUser.uid,
		assigneeUID : this['task-assignee'].querySelector('option:checked').getAttribute('uid'),
		assigneeName: this['task-assignee'].value,
		description : this['task-description'].value.replace(/\n\r?/g, '<br/>'),
		taskComplete : false,
		releaseDate : releaseDate,
		dueDateExists : dueDateExists,
		dueDateBasis : dueDateBasis,
		dueDate : dueDate
	}).then(() => {
		this.reset();
		alert('Task has been added');
	})
})

const taskSetting = document.querySelector('#task-setting');
taskSetting.addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanTugas').doc(auth.currentUser.uid).get().then(doc => {
		if(doc.exists){
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).update({
				completeAdm : this['allow-complete-task-adm'].checked,
				completeMem : this['allow-complete-task-mem'].checked,
				completeAse : this['allow-complete-task-ase'].checked,
				readAdm : this['allow-read-task-adm'].checked,
				readMem : this['allow-read-task-mem'].checked,
				readAse : this['allow-read-task-ase'].checked,
				editAdm : this['allow-edit-task-adm'].checked,
				editMem : this['allow-edit-task-mem'].checked,
				editAse : this['allow-edit-task-ase'].checked,
				delAdm : this['allow-delete-task-adm'].checked,
				delMem : this['allow-delete-task-mem'].checked,
				delAse : this['allow-delete-task-ase'].checked
			}).then(() => {
				alert('Task setting has been updated');
			})
		} else {
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).set({
				completeAdm : this['allow-complete-task-adm'].checked,
				completeMem : this['allow-complete-task-mem'].checked,
				completeAse : this['allow-complete-task-ase'].checked,
				readAdm : this['allow-read-task-adm'].checked,
				readMem : this['allow-read-task-mem'].checked,
				readAse : this['allow-read-task-ase'].checked,
				editAdm : this['allow-edit-task-adm'].checked,
				editMem : this['allow-edit-task-mem'].checked,
				editAse : this['allow-edit-task-ase'].checked,
				delAdm : this['allow-delete-task-adm'].checked,
				delMem : this['allow-delete-task-mem'].checked,
				delAse : this['allow-delete-task-ase'].checked
			}).then(() => {
				alert('Task setting has been setted');
			})			
		}
	})
})

const authForm = document.querySelectorAll('.auth-form');
const authFormToggle = document.querySelectorAll('.auth-form-toggle');

authFormToggle.forEach(item => {
    item.addEventListener('click', function(){
        switch(this.getAttribute('name')){
            case "sign-in":
            authForm.forEach(form => {
                if(form.getAttribute('name') == 'login-form'){
                    form.classList.add('d-block');                    
                    form.classList.remove('d-none');
                } else {
                    form.classList.add('d-none');
                    form.classList.remove('d-block');
                }
            })
            break;
            case "sign-up":
            authForm.forEach(form => {
                if(form.getAttribute('name') == 'register-form'){
                    form.classList.add('d-block');                    
                    form.classList.remove('d-none');
                } else {
                    form.classList.add('d-none');
                    form.classList.remove('d-block');
                }
            })            
            break;
            case "forgot-password":
            authForm.forEach(form => {
                if(form.getAttribute('name') == 'forgot-password-form'){
                    form.classList.add('d-block');                    
                    form.classList.remove('d-none');
                } else {
                    form.classList.add('d-none');
                    form.classList.remove('d-block');
                }
            })            
        }
    })
})

authForm.forEach(form => {
    form.addEventListener('submit', function(e){
        e.preventDefault();
        let name;
        let email = this['email'].value;
        let password;
        switch(this.getAttribute('name')){
            case "login-form":
            password = this['password'].value;
            auth.signInWithEmailAndPassword(email, password).then(() => {
                this.reset();
            })
            break;
            case "register-form":
            name = this['name'].value;            
            password = this['password'].value;
            auth.createUserWithEmailAndPassword(email, password).then(() => {
                this.reset();
                auth.currentUser.updateProfile({
                    displayName : name
                }).then(() => {
                    auth.currentUser.sendEmailVerification();
                })
            })            
            break;
            case "forgot-password-form":
            auth.sendPasswordResetEmail(email).then(() => {
                alert('We have emailed your password reset link, check it out!');
            })
        }        
    })
})
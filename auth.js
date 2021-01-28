auth.onAuthStateChanged(user => {
  if(user){
  	user.getIdTokenResult().then(idTokenResult => {
  		if(idTokenResult.claims.moderator){
		    db.collection('users').onSnapshot(snapshot =>{
		    	let att = 'no-user-registered';
		    	if(snapshot.docs.length == 0){
		    		colIsNone({list: authUserList, listBasis: authUserList.parentElement.nodeName, att: att, message: "There is no user registered in the site"});
		    	} else {
		    		if(document.querySelector(`[${att}]`)){
		    			document.querySelector(`[${att}]`).remove();
		    		}	    		
		    	}
		        let changes = snapshot.docChanges();
		        changes.forEach(change =>{
				    if(change.type == 'added'){
					    if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					        renderUserMod(change.doc);				        
					    }
				    } else if (change.type == 'modified'){
				        renderUpdateUser(change.doc);
				    } else if (change.type == 'removed'){
				    	document.querySelector('[data-id="' + change.doc.id + '"]').remove();
				    }
		        })
		    })
		} else {
			if(idTokenResult.claims.adminKantor){
				db.collection('users').onSnapshot(snapshot =>{
			        let changes = snapshot.docChanges();
			        changes.forEach(change =>{
					    if(change.type == 'added'){
						    if(auth.currentUser.uid != change.doc.id){			        
						        if(!addTask['assign-task-to'].querySelector('[uid="' + change.doc.id + '"]')){
						        	renderUserAdm(change.doc);
						        }
						    }
					    } else if (change.type == 'removed'){
					    	document.querySelector('[data-id="' + change.doc.id + '"]').remove();
					    }
			        })
			    })					
			}

		    let unsubcribe = db.collection('users').doc(auth.currentUser.uid).onSnapshot({
		    	includeMetadataChanges : true
		    }, doc => {
		    	let token = doc.data().token;
		    	if((token == null && idTokenResult.claims.moderator == false && idTokenResult.claims.adminKantor == false && idTokenResult.claims.member == false) || 
		    		(token == 'admin' && idTokenResult.claims.adminKantor)||
		    		(token == 'member' && idTokenResult.claims.member)){

		    	} else {
		    		user.getIdToken(true).then(() => {
		    			user.getIdTokenResult().then(idTokenResultAft => {
					    	if((token == null && idTokenResultAft.claims.moderator == false && idTokenResultAft.claims.adminKantor == false && idTokenResultAft.claims.member == false) || 
					    		(token == 'admin' && idTokenResultAft.claims.adminKantor)||
					    		(token == 'member' && idTokenResultAft.claims.member)){
					    		setTimeout(function(){
					    			location.reload(true);
					    		}, 3000)
					    	}		    			
		    			})
		    		})
		    	}
		    })			
		}

		db.collection('tasks').onSnapshot(snapshot =>{
			let indices = [	{complete : false, list : pendingTaskList, att : 'no-tasks-available', message : 'There is no available task'}, 
							{complete : true, list : completedTaskList, att : 'no-completed-tasks', message : 'There is no completed task'} ]
			indices.map(data => {
				db.collection('tasks').where('complete', '==', data.complete).get().then(querySnapshot => {
				   	if(querySnapshot.docs.length == 0){
				    	colIsNone({list: data.list, listBasis: data.list.parentElement.nodeName, att: data.att, message: data.message});
				    } else {
				    	if(document.querySelector(`[${data.att}]`)){
				    		document.querySelector(`[${data.att}]`).remove();
				    	}	    		
				    }
				})
			})	
		    let changes = snapshot.docChanges();
		    changes.forEach(change =>{
				if(change.type == 'added'){
					if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					    renderTask(change.doc);
					}
				} else if (change.type == 'modified'){
				    renderUpdateTask(change.doc);
				} else if (change.type == 'removed'){
				    document.querySelector('[data-id="' + change.doc.id + '"]').remove();
				    document.querySelector('#edit-task-modal' + change.doc.id).parentElement.remove();
				}
		    })
		})

		db.collection('goodsTransport').onSnapshot(snapshot => {
		    let changes = snapshot.docChanges();
		    changes.forEach(change =>{
				if(change.type == 'added'){
					if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					    renderGoodsTransport(change.doc);
					}
				} else if (change.type == 'modified'){
				    renderUpdateGoodsTransport(change.doc);
				} else if (change.type == 'removed'){
				    document.querySelector('[data-id="' + change.doc.id + '"]').remove();
				}
		    })			
		})

		db.collection('menuCategory').onSnapshot(snapshot => {
			let att = 'no-menus-created'
			if(snapshot.docs.length == 0){
				colIsNone({list: menuCategoryList, listBasis: menuCategoryList.nodeName, att: att, message: 'There is no menu created'});
			} else {
				if(document.querySelector(`[${att}]`)){
				    document.querySelector(`[${att}]`).remove();
				}				
			}
		    let changes = snapshot.docChanges();
		    changes.forEach(change =>{
				if(change.type == 'added'){
					if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
					    renderMenuCategory(change.doc);
					}
				} else if (change.type == 'modified'){
				    renderUpdateMenuCategory(change.doc);
				} else if (change.type == 'removed'){
				    document.querySelector('[data-id="' + change.doc.id + '"]').remove();
				}
		    })
		})

		db.collection('menuCategory').get().then(querySnapshot => {
			querySnapshot.docs.map(doc => {
				db.collection('menuCategory').doc(doc.id).collection('menu').onSnapshot(snapshot => {
					let changes = snapshot.docChanges();
					changes.forEach(change => {
						if(change.type == 'added'){
							if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
							    renderMenu(change.doc, doc);
							}
						} else if (change.type == 'modified'){
						    renderUpdateMenu(change.doc, doc);
						} else if (change.type == 'removed'){
						    document.querySelector('[data-id="' + change.doc.id + '"]').remove();
						}						
					})
				})
			})
		})

		db.collection('otherMenu').onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if(change.type == 'added'){
					if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
						renderOtherMenu(change.doc);
					}
				} else if (change.type == 'modified'){
					renderUpdateOtherMenu(change.doc);
				} else if (change.type == 'removed'){
					document.querySelector('[data-id="' + change.doc.id + '"]').remove();
				}				
			})
		})

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

function colIsNone(obj){
	let list = obj.list;
	let listBasis = obj.listBasis;
	let att = obj.att;
	let message = obj.message;
	let alert;
	switch(listBasis){
		case "TABLE":
			alert = document.createElement('tr');
			alert.setAttribute(att, '');
			alert.innerHTML = `<td colspan="${list.parentElement.querySelectorAll('thead tr th').length}" class="text-secondary p-5 border-bottom text-center">${message}</td>`;
			list.append(alert);
		break;
		case "DIV":
			alert = document.createElement('div');
			alert.setAttribute(att, '')
			alert.classList.add('p-5', 'text-secondary')
			alert.innerHTML = message;
			list.append(alert);
	}
}

const addTask = document.querySelector('#add-task');
addTask.addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('tasks').add({
		complete : false,
		assignedTo : this['assign-task-to'].value,
		taskPriority : this['task-priority'].value,
		description : this['task-description'].value.replace(/\n\r?/g, '<br/>'),
		taskmaster : auth.currentUser.displayName,
		taskmasterUID : auth.currentUser.uid,
		dueWeek : this['task-due-week'].value,
		dueDay : this['task-due-day'].value,
		dueHour : this['task-due-hour'].value,
		dueMinute : this['task-due-minute'].value,
		availableSince : new Date().getTime()
	}).then(() => {
		alert('Tugas berhasil ditambahkan!')
		this.reset();
	})
})

const addGoodsTransport = document.querySelector('#add-goods-transport');
addGoodsTransport.addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('goodsTransport').where('goodsTransportDate', '==', this['goods-transport-date'].value).get().then(querySnapshot => {
		if(querySnapshot.docs.length > 0){
			alert('Data perpindahan untuk tanggal berikut sudah ada!');
		} else {
			db.collection('goodsTransport').add({
				goodsTransportDate : this['goods-transport-date'].value,
				description : this['goods-transport-description'].value.replace(/\n\r?/g, '<br/>'),
				creator : auth.currentUser.displayName,
				creatorUID : auth.currentUser.uid
			}).then(() => {
				alert('Perpindahan berhasil ditambahkan!')
				this.reset();
			})
		}
	})	
})

const addMenuCategory = document.querySelector('#add-menu-category');
addMenuCategory.addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('menuCategory').add({
		dateCreate : new Date().getTime(),
		name : this['menu-category-name'].value
	}).then(() => {
		alert("Kategori menu berhasil ditambahkan!");
	})
})

const addOtherMenu = document.querySelector('#add-other-menu');
addOtherMenu.addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('otherMenu').add({
		dateCreate : new Date().getTime(),
		name : this['menu-name'].value,
		link : this['menu-link'].value
	}).then(() => {
		alert('Menu berhasil ditambahkan!')
		this.reset();
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
auth.onAuthStateChanged(user => {
  if(user){
    db.collection('user').onSnapshot(snapshot =>{
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
    }, err => {
    	firebaseError(err);
    })

    db.collection('pengaturanTugas').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added' || change.type == 'modified'){
            	renderPengaturanTugas(change.doc);
            }
        })
    }, err => {
    	firebaseError(err);
    })

    db.collection('tugass').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
            	    renderTugas(change.doc);
                }
            } else if(change.type == 'removed'){
            	let el = document.querySelector('[data-id="' + change.doc.id + '"]');
            	el.remove();
            } else if (change.type == 'modified'){
                renderUpdateTugas(change.doc);
            }
        })
    }, err => {
		firebaseError(err);
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
  } else {
  	setupUI();
  }
})

document.querySelector('#form-masuk').addEventListener('submit', formMasuk);

document.querySelector('#tambah-tugas').addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanTugas').doc(auth.currentUser.uid).get().then(function(doc){
		if(!doc.exists){
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).set({
				completeAdm : true,
				completeMem : false,
				completeAse : true,
				readAdm : true,
				readMem : false,
				readAse : true, 
				editAdm : true,
				editMem : false,
				editAse : false, 
				delAdm : true,
				delMem : false,
				delAse : false	
			})			
		}
		let dateRelease = new Date().getTime();
		if(document.querySelector('#set-due-date-task').checked){
			let dateDue = dateRelease;
			let dateDueWeek = false;
			let dateDueDay = false;
			let dateDueHour = false;
			let dateDueMinute = false;
			switch(document.querySelector('#due-date-basis').value){
				case "Week":
				dateDue = dateDue + (document.querySelector('#due-date-input').value * 7 * 24 * 60 * 60 * 1000);
				dateDueWeek = true;
				break;
				case "Day":
				dateDue = dateDue + (document.querySelector('#due-date-input').value * 24 * 60 * 60 * 1000);
				dateDueDay = true;
				break;
				case "Hour":
				dateDue = dateDue + (document.querySelector('#due-date-input').value * 60 * 60 * 1000);
				dateDueHour = true;
				break;
				case "Minute":
				dateDue = dateDue + (document.querySelector('#due-date-input').value * 60 * 1000);
				dateDueMinute = true;
			}
			db.collection('tugass').add({
				dateRelease : dateRelease,
				targetedUsername : this['penerima-tugas'].value,
				targetedUserUID : this['penerima-tugas'].querySelector('option:checked').getAttribute('uid'),
				status : 'PENDING',
				description : this['deskripsi-tugas'].value.replace(/\n\r?/g, '<br/>'),
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid,
				dateDueExists : true,
				dateDueWeek : dateDueWeek,
				dateDueDay : dateDueDay,
				dateDueHour : dateDueHour,
				dateDueMinute : dateDueMinute,
				dateDue : dateDue
			}).then(() => {
				$('#modal-tambah-tugas').modal('hide');
				alert('This task has been uploaded!');					
			})
		} else if(document.querySelector('#not-set-due-date-task').checked){
			db.collection('tugass').add({
				dateRelease : dateRelease,
				targetedUsername : this['penerima-tugas'].value,
				targetedUserUID : this['penerima-tugas'].querySelector('option:checked').getAttribute('uid'),
				status : 'PENDING',
				description : this['deskripsi-tugas'].value.replace(/\n\r?/g, '<br/>'),
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid,
				dateDueExists : false
			}).then(() => {
				$('#modal-tambah-tugas').modal('hide');
				alert('This task has been uploaded!');					
			})			
		}
	})
})

document.querySelector('#pengaturan-tugas').addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanTugas').doc(auth.currentUser.uid).get().then(function(doc){
		if(doc.exists){
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).update({
				completeAdm : this['izin-selesai-tugas-adm'].checked,
				completeMem : this['izin-selesai-tugas-mem'].checked,
				completeAse : this['izin-selesai-tugas-rec'].checked,
				readAdm : this['izin-baca-tugas-adm'].checked,
				readMem : this['izin-baca-tugas-mem'].checked,
				readAse : this['izin-baca-tugas-rec'].checked, 
				editAdm : this['izin-edit-tugas-adm'].checked,
				editMem : this['izin-edit-tugas-mem'].checked,
				editAse : this['izin-edit-tugas-rec'].checked, 
				delAdm : this['izin-hapus-tugas-adm'].checked,
				delMem : this['izin-hapus-tugas-mem'].checked,
				delAse : this['izin-hapus-tugas-rec'].checked
			}).then(() => {
				$('#modal-pengaturan-tugas').modal('hide');
				alert('Tasks settings has been updated!');
			})
		} else {
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).set({
				completeAdm : this['izin-selesai-tugas-adm'].checked,
				completeMem : this['izin-selesai-tugas-mem'].checked,
				completeAse : this['izin-selesai-tugas-rec'].checked,
				readAdm : this['izin-baca-tugas-adm'].checked,
				readMem : this['izin-baca-tugas-mem'].checked,
				readAse : this['izin-baca-tugas-rec'].checked, 
				editAdm : this['izin-edit-tugas-adm'].checked,
				editMem : this['izin-edit-tugas-mem'].checked,
				editAse : this['izin-edit-tugas-rec'].checked, 
				delAdm : this['izin-hapus-tugas-adm'].checked,
				delMem : this['izin-hapus-tugas-mem'].checked,
				delAse : this['izin-hapus-tugas-rec'].checked				
			}).then(() => {
				$('#modal-pengaturan-tugas').modal('hide');
				alert('Tasks settings has been setted!');
			})
		}
	})
})

function resendEmailVerification(e){
	e.preventDefault();
	auth.currentUser.sendEmailVerification().then(() => {
		alert('A verification link has been sent to your email addresses')
	}, err => {
		firebaseError(err);
	})
}

function formMasuk(e){
	e.preventDefault();
	let email = document.querySelector('#email-login').value;
	let password = document.querySelector('#password-login').value;
	auth.signInWithEmailAndPassword(email, password).then(() => {
		
	}).then(() => {
		e.target.reset();
	}, err => {
		firebaseError(err);
	})
}

function formDaftar(e){
	e.preventDefault();
	let nama = document.querySelector('#nama-login').value;
	let email = document.querySelector('#email-login').value;
	let password = document.querySelector('#password-login').value;
	auth.createUserWithEmailAndPassword(email, password).then(() => {
		e.target.reset();
		auth.currentUser.updateProfile({
			displayName : nama
		}).then(() => {
			auth.currentUser.sendEmailVerification();
		})
	}, err => {
		firebaseError(err);
	})
}

function formReset(e){
	e.preventDefault();
	let email = document.querySelector('#email-login').value;
	auth.sendPasswordResetEmail(email).then(() => {
		checkEmail(email);
	}, err => {
		firebaseError(err);
	})
}

function firebaseError(err){
	if(document.querySelector('#firebase-error')){
		if(document.querySelector('#firebase-error').innerHTML != err.message){
			document.querySelector('#firebase-error').remove();
		}
	} else {
		let alert = document.createElement('div');
		alert.setAttribute('id', 'firebase-error');
		alert.innerHTML = err.message;
		if(/Mobi/.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || window.innerWidth <= 900){
			alert.classList.add('alert-firebase-error-andro');
			if(document.querySelector('#form-reset')){
				document.querySelector('#label-forgot-password').parentElement.insertBefore(alert, document.querySelector('#label-forgot-password').nextSibling);
			} else if(document.querySelector('#form-daftar')){
				document.querySelector('#nama-login').parentElement.parentElement.insertBefore(alert, document.querySelector('#nama-login').parentElement);
			} else if(document.querySelector('#form-masuk')){
				document.querySelector('#email-login').parentElement.parentElement.insertBefore(alert, document.querySelector('#email-login').parentElement);
			}
		} else {
			alert.classList.add('alert-firebase-error');
			document.body.appendChild(alert)
		}

		setTimeout(function(){
			for(let opacity = 1; opacity >= 0; opacity = opacity.toFixed(1) - 0.1){
				setTimeout(function(){
					if(document.querySelector('#firebase-error')){
						document.querySelector('#firebase-error').style.opacity = opacity;
						if(opacity == 0){
							document.querySelector('#firebase-error').remove();
						}					
					}
				},300 + (1-opacity)*500)
			}
		}, 500)
	}	
}

function checkEmail(email){
	document.querySelector('#email-login').remove();
	let alert = document.createElement('div');
	alert.setAttribute('id', 'emailed-password-reset-link');
	alert.innerHTML = 'We have emailed your password reset link, check it out!';
	document.querySelector('#label-forgot-password').parentElement.insertBefore(alert, document.querySelector('#label-forgot-password').nextSibling);
	document.querySelector('#form-reset').querySelector('button[type=submit]').remove();

}
auth.onAuthStateChanged(user => {
  if(user){
    db.collection('pengguna').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                if(!document.querySelector('[data-id="' + change.doc.id + '"]')){
            		renderPengguna(change.doc);
                }
            } else if(change.type == 'removed'){

            } else if (change.type == 'modified'){
                renderUpdatePengguna(change.doc);
            }
        })
    }, err => {
		authError(err);
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
		authError(err);
	})	

    db.collection('pengaturanAktivitasKalender').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added' || change.type == 'modified'){
                renderPengaturanAktivitasKalender(change.doc);
            }
        })
    }, err => {
		authError(err);
	})	

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
		authError(err);
	})	

  	setupUI(user);  		
  } else {
  	setupUI();
  }
})

document.querySelector('#form-masuk').addEventListener('submit', formMasuk);

document.querySelector('#tambah-aktivitas-kalender').addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanAktivitasKalender').doc(auth.currentUser.uid).get().then(function(doc){
		if(doc.exists){
			db.collection('aktivitasKalender').add({
				date : document.querySelector('[current-date]').getAttribute('id'),
				description : this['deskripsi-aktivitas-kalender'].value.replace(/\n\r?/g, '<br/>'),
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid,
				readAdm : doc.data().readAdm,
				readMem : doc.data().readMem,
				editAdm : doc.data().editAdm,
				editMem : doc.data().editMem,
				delAdm : doc.data().delAdm,
				delMem : doc.data().delMem
			}).then(() => {
				$('#modal-tambah-aktivitas-kalender').modal('hide');
				alert('This event has been uploaded!');					
			})
		} else {
			db.collection('pengaturanAktivitasKalender').doc(auth.currentUser.uid).set({
				readAdm : true,
				readMem : true,
				editAdm : true,
				editMem : true,
				delAdm : true,
				delMem : true			
			})
			db.collection('aktivitasKalender').add({
				date : document.querySelector('[current-date]').getAttribute('id'),
				description : this['deskripsi-aktivitas-kalender'].value,
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid.replace(/\n\r?/g, '<br/>'),
				readAdm : true,
				readMem : true,
				editAdm : true,
				editMem : true,
				delAdm : true,
				delMem : true
			}).then(() => {
				$('#modal-tambah-aktivitas-kalender').modal('hide');
				alert('This event has been uploaded!');
			})		
		}
	})
})

document.querySelector('#pengaturan-aktivitas-kalender').addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanAktivitasKalender').doc(auth.currentUser.uid).get().then(function(doc){
		if(doc.exists){
			db.collection('pengaturanAktivitasKalender').doc(auth.currentUser.uid).update({
				readAdm : this['izin-baca-aktivitas-kalender-adm'].checked,
				readMem : this['izin-baca-aktivitas-kalender-mem'].checked,
				editAdm : this['izin-edit-aktivitas-kalender-adm'].checked,
				editMem : this['izin-edit-aktivitas-kalender-mem'].checked,
				delAdm : this['izin-hapus-aktivitas-kalender-adm'].checked,
				delMem : this['izin-hapus-aktivitas-kalender-mem'].checked
			}).then(() => {
				db.collection('aktivitasKalender').get().then(querySnapshot => {
					querySnapshot.docs.map(doc => {
						if(doc.data().userUID == auth.currentUser.uid){
							db.collection('aktivitasKalender').doc(doc.id).update({
								readAdm : this['izin-baca-aktivitas-kalender-adm'].checked,
								readMem : this['izin-baca-aktivitas-kalender-mem'].checked,
								editAdm : this['izin-edit-aktivitas-kalender-adm'].checked,
								editMem : this['izin-edit-aktivitas-kalender-mem'].checked,
								delAdm : this['izin-hapus-aktivitas-kalender-adm'].checked,
								delMem : this['izin-hapus-aktivitas-kalender-mem'].checked								
							}).then(() => {
								$('#modal-pengaturan-aktivitas-kalender').modal('hide');
								alert('Events calendar settings has been updated!');
							})
						}
					})
				})
			})
		} else {
			db.collection('pengaturanAktivitasKalender').doc(auth.currentUser.uid).set({
				readAdm : this['izin-baca-aktivitas-kalender-adm'].checked,
				readMem : this['izin-baca-aktivitas-kalender-mem'].checked,
				editAdm : this['izin-edit-aktivitas-kalender-adm'].checked,
				editMem : this['izin-edit-aktivitas-kalender-mem'].checked,
				delAdm : this['izin-hapus-aktivitas-kalender-adm'].checked,
				delMem : this['izin-hapus-aktivitas-kalender-mem'].checked
			}).then(() => {
				$('#modal-pengaturan-aktivitas-kalender').modal('hide');
				alert('Events calendar settings has been setted!');
			})		
		}
	})
})

document.querySelector('#tambah-tugas').addEventListener('submit', function(e){
	e.preventDefault();
	db.collection('pengaturanTugas').doc(auth.currentUser.uid).get().then(function(doc){
		if(doc.exists){
			db.collection('tugass').add({
				date : new Date().getTime(),
				targetedUsername : this['penerima-tugas'].value,
				targetedUserUID : this['penerima-tugas'].querySelector('option:checked').getAttribute('uid'),
				status : 'PENDING',
				description : this['deskripsi-tugas'].value.replace(/\n\r?/g, '<br/>'),
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid,
				completeAdm : doc.data().completeAdm,
				completeMem : doc.data().completeMem,
				completeAse : doc.data().completeAse,
				readAdm : doc.data().readAdm,
				readMem : doc.data().readMem,
				readAse : doc.data().readAse, 
				editAdm : doc.data().editAdm,
				editMem : doc.data().editMem,
				editAse : doc.data().editAse, 
				delAdm : doc.data().delAdm,
				delMem : doc.data().delMem,
				delAse : doc.data().delAse	
			}).then(() => {
				$('#modal-tambah-tugas').modal('hide');
				alert('This task has been uploaded!');					
			})
		} else {
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
			db.collection('tugass').add({
				date : new Date().getTime(),
				targetedUsername : this['penerima-tugas'].value,
				targetedUserUID : this['penerima-tugas'].querySelector('option:checked').getAttribute('uid'),
				status : 'PENDING',
				description : this['deskripsi-tugas'].value,
				username : auth.currentUser.displayName,
				userUID : auth.currentUser.uid.replace(/\n\r?/g, '<br/>'),
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
				completeAse : this['izin-selesai-tugas-mem'].checked,
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
				db.collection('tugas').get().then(querySnapshot => {
					querySnapshot.docs.map(doc => {
						if(doc.data().assignorUID == auth.currentUser.uid){
							db.collection('tugas').doc(doc.id).update({
								completeAdm : this['izin-selesai-tugas-adm'].checked,
								completeMem : this['izin-selesai-tugas-mem'].checked,
								completeAse : this['izin-selesai-tugas-mem'].checked,
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
						}
					})
				})
			})
		} else {
			db.collection('pengaturanTugas').doc(auth.currentUser.uid).set({
				completeAdm : this['izin-selesai-tugas-adm'].checked,
				completeMem : this['izin-selesai-tugas-mem'].checked,
				completeAse : this['izin-selesai-tugas-mem'].checked,
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
		authError(err);
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
		authError(err);
	})
}

function formDaftar(e){
	e.preventDefault();
	let nama = document.querySelector('#nama-login').value;
	let email = document.querySelector('#email-login').value;
	let password = document.querySelector('#password-login').value;
	auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('pengguna').doc(cred.user.uid).set({
            username : nama
        });		
	}).then(() => {
		e.target.reset();
		auth.currentUser.updateProfile({
			displayName : nama
		}).then(() => {
			auth.currentUser.sendEmailVerification();
		})
	}, err => {
		authError(err);
	})
}

function formReset(e){
	e.preventDefault();
	let email = document.querySelector('#email-login').value;
	auth.sendPasswordResetEmail(email).then(() => {
		checkEmail(email);
	}, err => {
		authError(err);
	})
}

function authError(err){
	if(document.querySelector('#auth-error')){
		if(document.querySelector('#auth-error').innerHTML != err.message){
			document.querySelector('#auth-error').remove();
		}
	} else {
		let alert = document.createElement('div');
		alert.setAttribute('id', 'auth-error');
		alert.innerHTML = err.message;
		if(/Mobi/.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || window.innerWidth <= 900){
			alert.classList.add('alert-auth-error-andro');
			if(document.querySelector('#form-reset')){
				document.querySelector('#label-forgot-password').parentElement.insertBefore(alert, document.querySelector('#label-forgot-password').nextSibling);
			} else if(document.querySelector('#form-daftar')){
				document.querySelector('#nama-login').parentElement.parentElement.insertBefore(alert, document.querySelector('#nama-login').parentElement);
			} else if(document.querySelector('#form-masuk')){
				document.querySelector('#email-login').parentElement.parentElement.insertBefore(alert, document.querySelector('#email-login').parentElement);
			}
		} else {
			alert.classList.add('alert-auth-error');
			document.body.appendChild(alert)
		}

		setTimeout(function(){
			for(let opacity = 1; opacity >= 0; opacity = opacity.toFixed(1) - 0.1){
				setTimeout(function(){
					if(document.querySelector('#auth-error')){
						document.querySelector('#auth-error').style.opacity = opacity;
						if(opacity == 0){
							document.querySelector('#auth-error').remove();
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
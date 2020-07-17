document.querySelector('#tombol-print').addEventListener('click',function(e){
            e.preventDefault();
            var printContents = document.querySelector('.preview-print').innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
})

//////////////////////Pengumuman////////////////////////
db.collection('pengumuman').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderPengumuman(change.doc);
        } else if (change.type == 'removed'){
            let div = isiPengumuman.querySelector('[data-id="' + change.doc.id + '"]');
            isiPengumuman.removeChild(div);
            document.querySelector('#edit').disabled = false;
            document.querySelector('#peringatan').style.display = "block";
        }
    })
})


const isiPengumuman = document.querySelector('#isipengumuman');


function renderPengumuman(doc){
if(isiPengumuman.childNodes.length === 0){
    isiPengumuman.innerHTML = `
    <div id="peringatan">
    <div id="judul-pengumuman" class="judulpengumuman">PENGUMUMAN</div>
    <div id="keterangan-pengumuman" class="peringatan-keterangan">Untuk saat ini tidak ada pemberitahuan pengumuman</div>
    </div>`
}else{
    document.querySelector('#peringatan').style.display = "none";
    document.querySelector('#edit').disabled = true;
    let div = document.createElement('div');
    div.setAttribute('data-id', doc.id);
    let judul = doc.data().judul;
    let keterangan = doc.data().keterangan;
    let tanggal = doc.data().tanggal;
    let sifat = doc.data().sifat;
    div.innerHTML=`
    <div id="judul-pengumuman" class="judulpengumuman${doc.id}">${judul}</div><a id="hapus${doc.id}" class="hapus"><i class="fa fa-close"></i></a>
    <small>Dibuat pada ${tanggal} <span class="badge badge-success baru">Baru</span> <span class="badge badge-danger baru">${sifat}</span></small>
    <div class="pembuka-pengumuman">Dear Admin Galaxy Camera</div>
    <div id="keterangan-pengumuman">${keterangan}</div>
    <div id="terimakasih">Terima Kasih atas Perhatiannya</div>
    `
    isiPengumuman.appendChild(div);

    

    let hapus = document.querySelector('a#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus pengumuman ini?');
    if(konfirmasi == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('pengumuman').doc(id).delete();
}
   
    });
  }
}



const createForm = document.querySelector('#tambah-pengumuman');
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var hours = ('0' + today.getHours()).slice(-2);
var minutes = ('0' + today.getMinutes()).slice(-2);
tanggal = dd + '/' + mm + '/' + yyyy;
jam = hours + ":" + minutes;



createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('pengumuman').add({
        judul: createForm['judul'].value.toUpperCase(),
        keterangan: createForm['keterangan'].value.replace(/\n\r?/g, '<br/>'),
        tanggal : tanggal + ', '+ jam,
        sifat: createForm['sifat'].value
    }).then(() => {
        $('#modalpengumuman').modal('hide');
        const selectbox = document.querySelector('#sifat');
        document.querySelector('#tambah-pengumuman').reset();
        selectbox.selectedIndex = null;

    })
})



//////////////////////Catatan////////////////////////

db.collection('catatan').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderCatatan(change.doc);
        } else if (change.type == 'removed'){
            let div = isiCatatan.querySelector('[data-id="' + change.doc.id + '"]');
            isiCatatan.removeChild(div);
        }
    })
})


const isiCatatan = document.querySelector('#isicatatan');
const editCatatan = document.querySelector('#editcatatan')

function renderCatatan(doc){
    let div = document.createElement('div');
    let edit = document.createElement('div');
    let keteranganCatatan = doc.data().keteranganCatatan;
    let tanggalCatatan = doc.data().tanggalCatatan;
    let creatorCatatan = doc.data().creatorCatatan;
    div.setAttribute('data-id', doc.id);
    div.innerHTML =`
    <div class="daftar-catatan">
    <div class="bg-dark judul-catatan">
    <div class="judul-daftar-catatan">Catatan @${creatorCatatan}</div>
    <small class="text-light">Dibuat pada ${tanggalCatatan}</small></div>
    <div class="keterangan-catatan">${keteranganCatatan}</div>
    </div>
    <a id="editya${doc.id}" class="editya" data-toggle="modal" data-target="#modaleditcatatan${doc.id}"><i class='fas fa-edit'></i> Edit</a><a id="hapusya${doc.id}" class="hapusya"><i class='fas fa-trash-alt'></i> Hapus</a>
    <div style="margin-bottom:10px;"></div>
    `
    edit.innerHTML =`
    <div class="modal fade" id="modaleditcatatan${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Mengubah Catatan</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
          <form id="form-edit-catatan${doc.id}">
                <div class="form-group">
                  <label class="col-form-label">Nama Penulis</label>
                  <input type="text" value="${creatorCatatan}" class="form-control" id="editcreatorcatatan${doc.id}" autocomplete="off" placeholder="Cantumkan Nama Anda" minlength="4" required>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Keterangan</label>
                  <textarea oninput="auto_grow(this)" class="form-control edit-keterangan" id="editketerangancatatan${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off" minlength="10" onfocus="auto_grow(this)" required>${keteranganCatatan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
            </div>
          </div>
       </div>
     </div>
    `
    isiCatatan.appendChild(div);
    editCatatan.appendChild(edit);

    let formEditCatatan = document.querySelector('#form-edit-catatan' + doc.id);
    formEditCatatan.addEventListener('submit', (e) => {
        e.preventDefault();
    let updateCreatorCatatan = document.querySelector('#editcreatorcatatan' + doc.id).value;
    let updateKeteranganCatatan = document.querySelector('#editketerangancatatan' + doc.id).value;

    db.collection('catatan').doc(doc.id).update({
    creatorCatatan : updateCreatorCatatan,
    keteranganCatatan : updateKeteranganCatatan.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modaleditcatatan' + doc.id).modal('hide');
        let div = isiCatatan.querySelector('[data-id=' + doc.id + ']');
        isiCatatan.removeChild(div);
            db.collection('catatan').onSnapshot(snapshot =>{
            if(isiCatatan.childNodes.length == 0){
                document.querySelector('#jumlahcatatan').innerText = '';
            }else{
                let badgeJumlahCatatan = isiCatatan.childNodes.length;
                document.querySelector('#jumlahcatatan').innerText = badgeJumlahCatatan;
            }
        })
            db.collection('catatan').onSnapshot(snapshot =>{
                if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
                document.querySelector('#jumlahinformasi').innerText = '';
            }else{
                let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
                document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
                }
            })
    let hapus1 = document.querySelector('a#hapusya' + doc.id);
    hapus1.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi1 = confirm('Anda yakin ingin menghapus catatan ini?');
    if(konfirmasi1 == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('catatan').doc(id).delete();
        }  
      })
        })
    })


    let hapus0 = document.querySelector('a#hapusya' + doc.id);
    hapus0.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi0 = confirm('Anda yakin ingin menghapus catatan ini?');
    if(konfirmasi0 == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('catatan').doc(id).delete();
        }  
      })


} 
       

const createForm1 = document.querySelector('#tambah-catatan');
var today1 = new Date();
var dd1 = String(today1.getDate()).padStart(2, '0');
var mm1 = String(today1.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy1 = today1.getFullYear();
var hours1 = ('0' + today1.getHours()).slice(-2);
var minutes1 = ('0' + today1.getMinutes()).slice(-2);
tanggal1 = dd1 + '/' + mm1 + '/' + yyyy1;
jam1 = hours1 + ":" + minutes1;

createForm1.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('catatan').add({
        keteranganCatatan: createForm1['keterangancatatan'].value.replace(/\n\r?/g, '<br/>'),
        tanggalCatatan: tanggal1 + ', '+ jam1,
        creatorCatatan: createForm1['creatorcatatan'].value
    }).then(() => {
        $('#modalcatatan').modal('hide');
        document.querySelector('#tambah-catatan').reset();
    })
})

    db.collection('catatan').onSnapshot(snapshot =>{
    if(isiCatatan.childNodes.length == 0){
        document.querySelector('#jumlahcatatan').innerText = '';
    }else{
        let badgeJumlahCatatan = isiCatatan.childNodes.length;
        document.querySelector('#jumlahcatatan').innerText = badgeJumlahCatatan;
        }
})

//////////////////////Promo////////////////////////

db.collection('promo').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderPromo(change.doc);
        } else if (change.type == 'removed'){
            let div = isiPromo.querySelector('[data-id="' + change.doc.id + '"]');
            isiPromo.removeChild(div);
        } else {
            renderPromo(change.doc);
        }
    })
})




const isiPromo = document.querySelector('#isipromo');
const editPromo = document.querySelector('#editpromo');


function renderPromo(doc){
    let div = document.createElement('div');
    let edit = document.createElement('div');
    let brandPromo = doc.data().brandPromo;
    let keteranganPromo = doc.data().keteranganPromo;
    let bulanPromo = doc.data().bulanPromo;
    let tanggalMulaiPromo = doc.data().tanggalMulaiPromo;
    let tanggalAkhirPromo = doc.data().tanggalAkhirPromo;
    let month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    let mulai = new Date(tanggalMulaiPromo);
    let akhir = new Date(tanggalAkhirPromo);
    mulai.setDate(mulai.getDate()+7);
    akhir.setDate(akhir.getDate()-7);
    let bulanmulai = month[mulai.getMonth()];
    let bulanakhir = month[mulai.getMonth()];
    let today2 = new Date();
    let dd2 = String(today2.getDate()).padStart(2, '0');
    let mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy2 = today2.getFullYear();
    tanggal2 = yyyy2 + '-' + mm2 + '-' + dd2;
    div.setAttribute('data-id', doc.id);
    div.style.margin = "0px 0px 8px";
    if(bulanmulai == bulanakhir){
        let bulanPromo = bulanmulai;
    div.innerHTML= `
<div class="card">
        <button class="btn btn-link card-header bg-dark" type="button" data-toggle="collapse" data-target="#collapse${doc.id}" aria-expanded="true" aria-controls="collapse${doc.id}">
          Promo ${brandPromo} Bulan ${bulanPromo} <span class="expired expired${doc.id}">Expired</span>
        </button>
    <div id="collapse${doc.id}" class="collapse">
      <div class="keterangan-promo card-body">
    ${keteranganPromo}<br>
    <div class="notes">Notes : Format YYYY/MM/DD</div>
    <div class="notes">${tanggalMulaiPromo} s.d  ${tanggalAkhirPromo}</div>
      </div>
    </div>
</div>
<a id="editya${doc.id}" class="editya" data-toggle="modal" data-target="#modaleditpromo${doc.id}"><i class='fas fa-edit'></i> Edit</a><a class="hapus-promo" id="hapus-promo${doc.id}"><i class='fas fa-trash-alt'></i> Hapus</a>
    `

    edit.innerHTML =`
<div class="modal fade" id="modaleditpromo${doc.id}" tabindex="-1" role="dialog" aria-labelledby="modaleditpromo" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="labelmodalpromo">Mengubah Promo</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
          <form id="form-edit-promo${doc.id}">
                <div class="form-group">
                  <label class="col-form-label">Brand</label>
                  <input type="text" class="form-control" id="editbrandpromo${doc.id}" value="${brandPromo}" autocomplete="off" required>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Keterangan</label>
                  <textarea oninput="auto_grow(this)" class="form-control" id="editketeranganpromo${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off" required>${keteranganPromo.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
            <div class="row">
                <div class="form-group col-6">
                  <label class="col-form-label">Started Date</label>
                  <input type="date" class="form-control" id="edittanggalmulaipromo${doc.id}" autocomplete="off" value="${tanggalMulaiPromo}" data-date-format="DD MMMM YYYY" required>
                </div>
                <div class="form-group col-6">
                  <label class="col-form-label">Expiration Date</label>
                  <input type="date" class="form-control" id="edittanggalakhirpromo${doc.id}" autocomplete="off" value="${tanggalAkhirPromo}" data-date-format="DD MMMM YYYY" required>
                </div>
            </div>
                <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
            </div>
          </div>
       </div>
     </div>`

    
    isiPromo.appendChild(div);
    editPromo.appendChild(edit);
}
    let formEditPromo = document.querySelector('#form-edit-promo' + doc.id);
    formEditPromo.addEventListener('submit', (e) => {
        e.preventDefault();
    let updateBrandPromo = document.querySelector('#editbrandpromo' + doc.id).value;
    let updateKeteranganPromo = document.querySelector('#editketeranganpromo' + doc.id).value;
    let updateTanggalMulaiPromo = document.querySelector('#edittanggalmulaipromo' + doc.id).value;
    let updateTanggalAkhirPromo = document.querySelector('#edittanggalakhirpromo' + doc.id).value;

    db.collection('promo').doc(doc.id).update({
        brandPromo : updateBrandPromo,
        keteranganPromo : updateKeteranganPromo.replace(/\n\r?/g, '<br/>'),
        tanggalMulaiPromo : updateTanggalMulaiPromo,
        tanggalAkhirPromo : updateTanggalAkhirPromo
    }).then(() => {
        $('#modaleditpromo' + doc.id).modal('hide');
        let div = isiPromo.querySelector('[data-id=' + doc.id + ']');
        isiPromo.removeChild(div);
        db.collection('promo').onSnapshot(snapshot =>{
        if(isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahpromo').innerText = '';
        }else{
            let badgeJumlahPromo = isiPromo.childNodes.length;
            document.querySelector('#jumlahpromo').innerText = badgeJumlahPromo;
        }
        })

        db.collection('promo').onSnapshot(snapshot =>{
            if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahinformasi').innerText = '';
        }else{
            let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
            document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
            }
        })

        let hapus3 = document.querySelector('#hapus-promo' + doc.id);
        hapus3.addEventListener('click', function(e){
        e.stopPropagation();
        let konfirmasi2 = confirm('Anda yakin ingin menghapus promo ini?');
        if(konfirmasi2 == true){
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('promo').doc(id).delete();

            }
        })
    })
})

    db.collection('promo').onSnapshot(snapshot =>{
        if(tanggalAkhirPromo == tanggal2){
        document.querySelector('.expired' + doc.id).style.display = 'block';
        }
      })


    let hapus2 = document.querySelector('#hapus-promo' + doc.id);
    hapus2.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi3 = confirm('Anda yakin ingin menghapus promo ini?');
    if(konfirmasi3 == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('promo').doc(id).delete();
        }
    })


}



const createForm2 = document.querySelector('#tambah-promo');

createForm2.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('promo').add({
        brandPromo: createForm2['brandpromo'].value,
        keteranganPromo: createForm2['keteranganpromo'].value.replace(/\n\r?/g, '<br/>'),
        tanggalMulaiPromo : createForm2['tanggalmulaipromo'].value,
        tanggalAkhirPromo : createForm2['tanggalakhirpromo'].value
    }).then(() => {
        $('#modalpromo').modal('hide')
        document.querySelector('#tambah-promo').reset();
    })
})

db.collection('promo').onSnapshot(snapshot =>{
if(isiPromo.childNodes.length == 0){
    document.querySelector('#jumlahpromo').innerText = '';
}else{
    let badgeJumlahPromo = isiPromo.childNodes.length;
    document.querySelector('#jumlahpromo').innerText = badgeJumlahPromo;
    }
})
//////////////////////Informasi////////////////////////

db.collection('catatan').onSnapshot(snapshot =>{
    if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
    document.querySelector('#jumlahinformasi').innerText = '';
}else{
    let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
    document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
    }
})



db.collection('promo').onSnapshot(snapshot =>{
    if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
    document.querySelector('#jumlahinformasi').innerText = '';
}else{
    let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
    document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
    }
})


//////////////////////Marquee////////////////////////


db.collection('marquee').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderMarquee(change.doc);
            document.querySelector('#reset-marquee').classList.remove('disabled');
            document.querySelector('#edit-marquee').classList.add('disabled');
        }else if (change.type == 'removed'){
            document.querySelectorAll('[data-id="' + change.doc.id + '"]').forEach(e =>
            e.parentNode.removeChild(e));
            document.querySelector('#reset-marquee').classList.add('disabled');
            document.querySelector('#edit-marquee').classList.remove('disabled');
        } 
    })
})


const isiMarquee = document.querySelector('#isimarquee');
const password = document.querySelector('#password');

//db.collection('marquee').onSnapshot(snapshot =>{
//    if(isiMarquee.childNodes.length == 0){
//    var callback = function() {
//    var today = new Date();
//    var hours = ('0' + today.getHours()).slice(-2);
//    var minutes = ('0' + today.getMinutes()).slice(-2);
//    var seconds = ('0' + today.getSeconds()).slice(-2);
//    isiMarquee.textContent = "Waktu Saat ini " + hours + ":" + minutes + ":" + seconds;
//   }
//   callback();
//   window.setInterval( callback, 1000 );
// }
//});


function renderMarquee(doc){
    isiMarquee.setAttribute('data-id', doc.id);
    let keteranganMarquee = doc.data().keteranganMarquee;
    isiMarquee.innerHTML = keteranganMarquee

    let reset = document.querySelector('#reset-marquee');
    reset.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin mereset ulang teks berjalan ini?');
    if(konfirmasi == true){
    e.preventDefault();
    let id = isiMarquee.getAttribute('data-id');
    db.collection('marquee').doc(id).delete();
    window.location.reload();
        }
    })

    }

const createForm3 = document.querySelector('#tambah-marquee');
const pin = Math.floor(Math.random()*5000) + 1000;
document.querySelector('#kode-pin').textContent = pin;
createForm3.addEventListener('submit', (e) => {
    if(password.value == pin){
    e.preventDefault();
    db.collection('marquee').add({
        keteranganMarquee: createForm3['keteranganmarquee'].value
    }).then(() => {
        $('#modalmarquee').modal('hide')
        document.querySelector('#tambah-marquee').reset();
    })
}else{
    alert('Kode pin yang anda masukkan salah!')
    e.preventDefault();
}

})



//////////////////////Data Cust////////////////////////

db.collection('customer').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderCustomer(change.doc);
        } else if (change.type == 'removed'){
            let div = isiCustomer.querySelector('[data-id="' + change.doc.id + '"]');
            isiCustomer.removeChild(div);
        }
    })
})

db.collection('customer').onSnapshot(snapshot =>{
if(isiCustomer.childNodes.length == 0){
    document.querySelector('#jumlahcust').innerText = '';
}else{
    let badgeJumlahCust = isiCustomer.childNodes.length;
    document.querySelector('#jumlahcust').innerText = badgeJumlahCust;
}
})

const isiCustomer = document.querySelector('#isicust');


function renderCustomer(doc){
    let div = document.createElement('div');
    div.setAttribute('data-id', doc.id);
    let namaCust = doc.data().namaCust;
    let kontakCust = doc.data().kontakCust;
    let daftarProduk = doc.data().daftarProduk;
    let sifatTransaksi = doc.data().sifatTransaksi;
    let sifatCust = doc.data().sifatCust;
    let emailCust = doc.data().emailCust;
    div.innerHTML=`
    <div class="card">
        <button class="btn btn-link card-header bg-dark" type="button" data-toggle="collapse" data-target="#collapse${doc.id}" aria-expanded="true" aria-controls="collapse${doc.id}">
          ${sifatTransaksi} Produk a.n ${namaCust} <span class="badge badge-danger baru">${sifatCust}</span>
        </button>
    <div id="collapse${doc.id}" class="collapse">
      <div class="keterangan-promo card-body">
    <div class="row">
    <div class="col-4">Nama Customer : ${namaCust}</div>
    <div class="col-4">Kontak Customer : ${kontakCust}</div>
    <div class="col">Email Customer : <span id="email${doc.id}">${emailCust}</span></div>
    </div>
    <div class="row">
    <div class="col" style="text-align:center;">
    <div>Produk yang dicari :</div>
    <div>${daftarProduk}</div>
    </div>
       </div>
      </div>
    </div>
</div>
<a class="hapus-cust" id="hapus-cust${doc.id}"><i class='fas fa-trash-alt'></i> Hapus</a>
    `
    isiCustomer.appendChild(div);

    if(document.querySelector('span#email' + doc.id).childNodes.length == 0){
        document.querySelector('span#email' + doc.id).innerHTML = "Tidak ada";
    }

    let hapus4 = document.querySelector('a#hapus-cust' + doc.id);
    hapus4.addEventListener('click', function(e){
    e.stopPropagation();
    var konfirmasi4 = confirm('Anda yakin ingin menghapus data ini?');
    if(konfirmasi4 == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('customer').doc(id).delete();


        }
    });

  }



const createForm4 = document.querySelector('#tambah-cust');

createForm4.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('customer').add({
        namaCust: createForm4['namacust'].value,
        kontakCust: createForm4['kontakcust'].value,
        daftarProduk : createForm4['daftarproduk'].value.replace(/\n\r?/g, '<br/>'),
        sifatCust: createForm4['sifatcust'].value,
        sifatTransaksi: createForm4['sifattransaksi'].value,
        emailCust : createForm4['emailcust'].value
    }).then(() => {
        $('#modalcust').modal('hide')
        const selectbox = document.querySelector('#sifatcust');
        const selectbox1 = document.querySelector('#sifattransaksi');
        document.querySelector('#tambah-cust').reset();
        selectbox.selectedIndex = null;
        selectbox1.selectedIndex = null;

    })
})


//////////////////////Kalkulator////////////////////////

db.collection('kalkulator').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderKalkulator(change.doc);
            document.querySelector('#reset').classList.remove('disabled');
            document.querySelector('#edit-kalkulator').classList.add('disabled');
        } else if (change.type == 'removed'){
            document.querySelectorAll('[data-id="' + change.doc.id + '"]').forEach(e =>
            e.parentNode.removeChild(e));
            document.querySelector('#reset').classList.add('disabled');
            document.querySelector('#edit-kalkulator').classList.remove('disabled');
        }
    })
})


const isiKalkulator = document.querySelector('#isikalkulator');
const password1 = document.querySelector('#password1');
const createForm6 = document.querySelector('#tambah-kalkulator1');
function renderKalkulator(doc){
    let biayaAdmin = doc.data().biayaAdmin;
    let bunga = doc.data().bunga;
    let biayaAdmin1 = document.querySelector('#biayaadmin1');
    let bunga1 = document.querySelector('#bunga1');
    biayaAdmin1.setAttribute('data-id', doc.id);
    bunga1.setAttribute('data-id', doc.id);
    let newAdmin = biayaAdmin1.innerHTML=`Rp ${biayaAdmin}`;
    let newBunga = bunga1.innerHTML=`${bunga}%`;
    let newAdmin1 = newAdmin.split("Rp ");
    let newBunga1 = newBunga.split("%");
    let newAdmin2 = newAdmin1[1];
    let newBunga2 = newBunga1[0];
    //console.log(typeof(newAdmin2));
    //console.log(typeof(newBunga2));
    //console.log(newAdmin2);
    //console.log(newBunga2);
    let newAdmin3 = Number(newAdmin2);
    let newBunga3 = Number(newBunga2);
    //console.log(typeof(newAdmin3));
    //console.log(typeof(newBunga3));
    //console.log(newAdmin3);
    //console.log(newBunga3);


    const createForm6 = document.querySelector('#tambah-kalkulator1');
    createForm6.addEventListener('submit', (e) => {
        e.preventDefault();
        let harga = Number(document.querySelector('#harga').value);
        let dp = Number(document.querySelector('#dp').value);
        let dpSesungguhnya = (dp - newAdmin3);
        let hargaSesungguhnya = (harga - dpSesungguhnya);
        let bunga = (hargaSesungguhnya * newBunga3/100);
        let admin = 5000;
        let cicilan3 = (hargaSesungguhnya/3)+ bunga + admin;
        let cicilan6 = (hargaSesungguhnya/6)+ bunga + admin;
        let cicilan9 = (hargaSesungguhnya/9)+ bunga + admin;
        let cicilan12 = (hargaSesungguhnya/12)+ bunga + admin;
        let cicilan15 = (hargaSesungguhnya/15)+ bunga + admin;
        let cicilan18 = (hargaSesungguhnya/18)+ bunga + admin;
        let cicilan21 = (hargaSesungguhnya/21)+ bunga + admin;
        let cicilan24 = (hargaSesungguhnya/24)+ bunga + admin;
        let mathcicilan3 = Math.ceil(cicilan3/100)*100;
        let mathcicilan6 = Math.ceil(cicilan6/100)*100;
        let mathcicilan9 = Math.ceil(cicilan9/100)*100;
        let mathcicilan12 = Math.ceil(cicilan12/100)*100;
        let mathcicilan15 = Math.ceil(cicilan15/100)*100;
        let mathcicilan18 = Math.ceil(cicilan18/100)*100;
        let mathcicilan21 = Math.ceil(cicilan21/100)*100;
        let mathcicilan24 = Math.ceil(cicilan24/100)*100;


          document.querySelector('#hasil-perhitungan-dp').innerHTML = "Berikut cicilan dengan DP " + parseInt(dp).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          document.querySelector('#hasil-perhitungan-dp').style.display = "block";

          document.querySelector('#info-cicilan').innerHTML = "Untuk info promo dan list angsuran lainnya silahkan klik link berikut https://galaxycamera.id/cicilan-tanpa-cc";
          document.querySelector('#info-cicilan').style.display = "block"


        if(document.querySelector('#tenor3').checked){
          document.querySelector('#hasil-perhitungan-tenor3').innerHTML = "3x : " + mathcicilan3.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor3').style.display = "block";    
        }else{
            document.querySelector('#hasil-perhitungan-tenor3').style.display = "none";
        }


        if(document.querySelector('#tenor6').checked){
          document.querySelector('#hasil-perhitungan-tenor6').innerHTML = "6x : " + mathcicilan6.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor6').style.display = "block";    
        }else{
            document.querySelector('#hasil-perhitungan-tenor6').style.display = "none";
        }

        if(document.querySelector('#tenor9').checked){
          document.querySelector('#hasil-perhitungan-tenor9').innerHTML = "9x : " + mathcicilan9.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })     
          document.querySelector('#hasil-perhitungan-tenor9').style.display = "block";
        }else{
            document.querySelector('#hasil-perhitungan-tenor9').style.display = "none";
        }

        if(document.querySelector('#tenor12').checked){
          document.querySelector('#hasil-perhitungan-tenor12').innerHTML = "12x : " + mathcicilan12.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor12').style.display = "block";       
        }else{
            document.querySelector('#hasil-perhitungan-tenor12').style.display = "none";
        }

        if(document.querySelector('#tenor15').checked){
          document.querySelector('#hasil-perhitungan-tenor15').innerHTML = "15x : " + mathcicilan15.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor15').style.display = "block";     
        }else{
            document.querySelector('#hasil-perhitungan-tenor15').style.display = "none";
        }

        if(document.querySelector('#tenor18').checked){
          document.querySelector('#hasil-perhitungan-tenor18').innerHTML = "18x : " + mathcicilan18.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor18').style.display = "block";       
        }else{
            document.querySelector('#hasil-perhitungan-tenor18').style.display = "none";
        }

        if(document.querySelector('#tenor21').checked){
          document.querySelector('#hasil-perhitungan-tenor21').innerHTML = "21x : " + mathcicilan21.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor21').style.display = "block";       
        }else{
            document.querySelector('#hasil-perhitungan-tenor21').style.display = "none";
        }

        if(document.querySelector('#tenor24').checked){
          document.querySelector('#hasil-perhitungan-tenor24').innerHTML = "24x : " + mathcicilan24.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
            })
          document.querySelector('#hasil-perhitungan-tenor24').style.display = "block";     
        }else{
            document.querySelector('#hasil-perhitungan-tenor24').style.display = "none";
        }

        if(document.querySelector('#tenor3').checked === false && document.querySelector('#tenor6').checked === false && document.querySelector('#tenor9').checked === false && document.querySelector('#tenor12').checked === false && document.querySelector('#tenor15').checked === false && document.querySelector('#tenor18').checked === false && document.querySelector('#tenor21').checked === false && document.querySelector('#tenor24').checked === false){
            document.querySelector('#hasil-perhitungan-peringatan').innerHTML = "Anda belum memilih tenor yang akan diperhitungkan";
            document.querySelector('#hasil-perhitungan-peringatan').style.display = "block";
            document.querySelector('#info-cicilan').style.display = "none";
            document.querySelector('#hasil-perhitungan-dp').style.display = "none";
            document.querySelector('#copas').style.display = "none";
        }else{
            document.querySelector('#hasil-perhitungan-peringatan').style.display = "none";
            document.querySelector('#copas').style.display = "block"; 
        }

})

    let copas = document.querySelector("#copas");
    copas.addEventListener('click', function (e) {
    var range = document.getSelection().getRangeAt(0);
    range.selectNode(document.querySelector("#copas-hasil"));
    window.getSelection().addRange(range);
    document.execCommand("copy")

  });


    let reset = document.querySelector('#reset');
    reset.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus konfigurasi ini?');
    if(konfirmasi == true){
    e.preventDefault();
    let hapusini = biayaAdmin1.getAttribute('data-id');
    let hapusini1 = bunga1.getAttribute('data-id');
    db.collection('kalkulator').doc(hapusini).delete();
    db.collection('kalkulator').doc(hapusini1).delete();

        }
    })
}


db.collection('kalkulator').onSnapshot(snapshot =>{
    if(document.querySelector('#bunga1').childNodes.length == 0 && document.querySelector('#biayaadmin1').childNodes.length == 0){
        document.querySelector('#hitung').classList.add('disabled');
    }if(document.querySelector('#bunga1').childNodes.length != 0 && document.querySelector('#biayaadmin1').childNodes.length != 0){
        document.querySelector('#hitung').classList.remove('disabled');
    }
})

db.collection('kalkulator').onSnapshot(snapshot =>{
    if(document.querySelector('#biayaadmin1').childNodes.length == 0){
        document.querySelector('#biayaadmin1').innerHTML = `Rp 0`;
    } 
})


db.collection('kalkulator').onSnapshot(snapshot =>{
    if(document.querySelector('#bunga1').childNodes.length == 0){
        document.querySelector('#bunga1').innerHTML = `0%`;
    } 
})





const createForm5 = document.querySelector('#tambah-kalkulator');
const pin1 = Math.floor(Math.random()*5000) + 1000;
document.querySelector('#kode-pin-kalkulator').textContent = pin1;
createForm5.addEventListener('submit', (e) => {
if(password1.value == pin1){
    e.preventDefault();
    db.collection('kalkulator').add({
        biayaAdmin: createForm5['biayaadmin'].value,
        bunga : createForm5['bunga'].value
    }).then(() => {
        $('#modalkalkulator').modal('hide')
        document.querySelector('#tambah-kalkulator').reset();
    })
}else{
    alert('Kode pin yang anda masukkan salah!')
    e.preventDefault();
}

})

//////////////////////Tugas////////////////////////

db.collection('tugas').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderTugas(change.doc);
        } else if (change.type == 'removed'){
            document.querySelectorAll('div[data-id="' + change.doc.id + '"]').forEach(e =>
            e.parentNode.removeChild(e))
        } 
    })
})

db.collection('tugas').onSnapshot(snapshot =>{
if(isiTugas.childNodes.length == 0){
    document.querySelector('#jumlahtugas').innerText = '';
}else{
    let badgeJumlahTugas = isiTugas.childNodes.length;
    document.querySelector('#jumlahtugas').innerText = badgeJumlahTugas;
}
})

db.collection('tugas').onSnapshot(snapshot =>{
if(isiTugasCompleted.childNodes.length == 0){
    document.querySelector('#jumlahselesai').innerText = '';
}else{
    let badgeJumlahTugasCompleted = isiTugasCompleted.childNodes.length;
    document.querySelector('#jumlahselesai').innerText = badgeJumlahTugasCompleted;
}
})

const isiTugas = document.querySelector('#daftar-tugas-pending');
const isiTugasCompleted = document.querySelector('#daftar-tugas-selesai');

function renderTugas(doc){
    let div = document.createElement('div');
    div.classList.add('tugas-pending');
    div.setAttribute('data-id', doc.id);
    let deskripsiTugas = doc.data().deskripsiTugas;
    let tanggalPembuatan = doc.data().tanggalPembuatan;
    let div1 = document.createElement('div');
    div1.classList.add('tugas-selesai');
    div1.setAttribute('data-id', doc.id);
    let deskripsiTugas1 = doc.data().deskripsiTugas1;
    let tanggalPembuatan1 = doc.data().tanggalPembuatan1;
    let tanggalPenyelesaian = doc.data().tanggalPenyelesaian;
    if(deskripsiTugas1 != undefined && tanggalPembuatan1 != undefined){
    div1.innerHTML = `
    <div class="deskripsi-tugas-selesai"><div class="keterangan-tugas-selesai">Dibuat pada <span id="tanggal${doc.id}">${tanggalPembuatan1}</span> - <span id="deskripsi${doc.id}">${deskripsiTugas1}</span></div>
    <small id="penyelesaian${doc.id}" class="penyelesaian">Diselesaikan pada ${tanggalPenyelesaian} </small></div>
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
    <i id="hapustugasselesai${doc.id}" class='fas fa-trash-alt hapustugasselesai'></i>
    `
    isiTugasCompleted.appendChild(div1);

    let hapus = document.querySelector('#hapustugasselesai' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus ini?');
    if(konfirmasi == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('tugas').doc(id).delete();
    }   
  })

    $(document).ready(function() {
    db.collection('tugas').onSnapshot(snapshot =>{
    var items = $('#daftar-tugas-selesai > .tugas-selesai').get();
    items.sort(function(a, b) {
    var keyA = $(a).text();
    var keyB = $(b).text();
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
    })
    var daftarTugasSelesai = $('#daftar-tugas-selesai');
    $.each(items, function(i, div) {
    daftarTugasSelesai.append(div);
  })
  })
})

}
    if(deskripsiTugas != undefined && tanggalPembuatan != undefined){
    div.innerHTML = `
        <div class="deskripsi-tugas">Dibuat pada <span id="tanggal${doc.id}">${tanggalPembuatan}</span> - <span id="deskripsi${doc.id}">${deskripsiTugas}</span></div>
        <i id="selesaikan${doc.id}" class='fas fa-check selesaikantugas'></i>
        <i id="hapus${doc.id}" class='fas fa-trash-alt hapustugas'></i>
    `
    isiTugas.appendChild(div);

    let selesaikan = document.querySelector('#selesaikan' + doc.id);
    selesaikan.addEventListener('click', function (e){
    let today4 = new Date();
    let dd4 = String(today4.getDate()).padStart(2, '0');
    let mm4 = String(today4.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy4 = today4.getFullYear();
    let hours4 = ('0' + today4.getHours()).slice(-2);
    let minutes4 = ('0' + today4.getMinutes()).slice(-2);
    tanggal4 = mm4 + '/' + dd4 + '/' + yyyy4;
    jam4 = hours4 + ":" + minutes4;
    e.stopPropagation();
    db.collection('tugas').add({
        tanggalPembuatan1: document.querySelector('#tanggal' + doc.id).textContent,
        deskripsiTugas1: document.querySelector('#deskripsi' + doc.id).textContent,
        tanggalPenyelesaian: tanggal4 + ', '+ jam4
    }).then(() => {
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tugas').doc(id).delete();
    })
})

    let hapus = document.querySelector('#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus tugas ini?');
    if(konfirmasi == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('tugas').doc(id).delete();
    }   
  })

$(document).ready(function() {
db.collection('tugas').onSnapshot(snapshot =>{
    var items = $('#daftar-tugas-pending > .tugas-pending').get();
    items.sort(function(a, b) {
    var keyA = $(a).text();
    var keyB = $(b).text();
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
    })
    var daftarTugasPending = $('#daftar-tugas-pending');
    $.each(items, function(i, div) {
    daftarTugasPending.append(div);
  })
  })
})

}


}

const createForm7 = document.querySelector('#form-tugas');
createForm7.addEventListener('submit', (e) => {
    let today3 = new Date();
    let dd3 = String(today3.getDate()).padStart(2, '0');
    let mm3 = String(today3.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy3 = today3.getFullYear();
    let hours3 = ('0' + today3.getHours()).slice(-2);
    let minutes3 = ('0' + today3.getMinutes()).slice(-2);
    tanggal3 = mm3 + '/' + dd3 + '/' + yyyy3;
    jam3 = hours3 + ":" + minutes3;
    e.preventDefault();
    db.collection('tugas').add({
        deskripsiTugas: createForm7['tugas'].value.replace(/\n\r?/g, '<br/>'),
        tanggalPembuatan: tanggal3 + ', '+ jam3
    }).then(() => {
        document.querySelector('#form-tugas').reset();
    })
})

document.querySelector('#judul-pending-task').addEventListener('click', function(){
if(document.querySelector('#judul-pending-task').classList.contains('collapsed') == true){
    document.querySelector('.pending').classList.remove('fa-angle-down');
    document.querySelector('.pending').classList.add('fa-angle-up');
}else{
    document.querySelector('.pending').classList.add('fa-angle-down');
    document.querySelector('.pending').classList.remove('fa-angle-up');
}
})

document.querySelector('#judul-completed-task').addEventListener('click', function(){
if(document.querySelector('#judul-completed-task').classList.contains('collapsed') == true){
    document.querySelector('.completed').classList.remove('fa-angle-down');
    document.querySelector('.completed').classList.add('fa-angle-up');
}else{
    document.querySelector('.completed').classList.add('fa-angle-down');
    document.querySelector('.completed').classList.remove('fa-angle-up');
}
})

const isiPreview = document.querySelector('#preview-print')
const createForm8 = document.querySelector('#form-cetak');
createForm8.addEventListener('submit', (e) => {
    e.preventDefault();
    let namaCust = document.querySelector('#nama-shipping-customer').value;
    let kontakCust = document.querySelector('#kontak-shipping-customer').value;
    let ekspedisiCust = document.querySelector('#ekspedisi-shipping-customer').value;
    let alamatCust = document.querySelector('#alamat-shipping-customer').value.replace(/\n\r?/g, '<br/>');
    let div = document.createElement('div');
    div.classList.add('potongan-kertas');

    div.innerHTML = `
        <div class="super-header-cetak">
          <img src="logo.png" class="logo-cetak">
          <div class="label-pengiriman">Label Pengiriman</div>          
        </div>
        <div class="header-cetak">
            <div class="penjual">From</div>
            <div>:</div>
            <div>
              <div class="nama-penjual"><span class="nama-logo">GALAXYCAMERA.ID</span></div>
              <div class="alamat-penjual">Mall Metropolis Townsquare, Lantai Dasar Blok GC1 No.7, Cikokol, Tangerang</div>
              <div class="kontak-penjual">082111311131</div>
            </div>
          </div>
        <div class="body-cetak">
          <div class="ship-to">
            <div>Ship to</div>
            <div>:</div>
            <div>
              <div class="nama-pembeli">${namaCust}</div>
              <div class="alamat-pembeli">${alamatCust}</div>
              <div class="kontak-pembeli">${kontakCust}</div>
            </div>
            <div>Ekspedisi</div>
            <div>:</div>
              <div class="ekspedisi-terpilih">${ekspedisiCust}</div>
          </div>
      </div>
      <div class="footer-cetak">
        <div class="keterangan-footer">Terima Kasih Sudah Berbelanja di <span class="nama-logo">GALAXYCAMERA.ID</span></div>
      </div>`

      isiPreview.appendChild(div);
})


function auto_grow(element){
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}



document.querySelector(".your_class").addEventListener("keypress", function (evt) {
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});


//document.addEventListener('contextmenu', event => event.preventDefault());


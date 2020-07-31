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
        } else if(change.type == 'modified'){
            renderEditPengumuman(change.doc);
        }
    })
})


const isiPengumuman = document.querySelector('#isipengumuman');
const editPengumuman = document.querySelector('#editpengumuman');


function renderPengumuman(doc){
let div = document.createElement('div');
let pengumuman = document.createElement('div');
div.setAttribute('data-id', doc.id);
let judul = doc.data().judul;
let keterangan = doc.data().keterangan;
let tanggal = doc.data().tanggal;
let sifat = doc.data().sifat;
div.classList.add('dokumentasi-pengumuman' + doc.id);
div.innerHTML = `
    <div class="jumbotron jumbotron-fluid" id="editya${doc.id}" data-toggle="modal" data-target="#modaleditpengumuman${doc.id}" style="cursor:pointer;margin-bottom:10px;background-image:url(image/jumbotron2.jpg);background-position:bottom;">
      <div class="container">
        <h1 class="display-4"><span id="judul-pengumuman${doc.id}" style="font-weight:bold;color:white;">${judul}</span> <span id="badge${doc.id}" class="badge badge-danger badge-penting" style="display:none;">Penting</span></h1>
        <p class="lead" style="color:white;font-size:24px;">${tanggal}, <span id="keterangan-pengumuman${doc.id}">${keterangan}</span></p>
      </div>
    </div>
    `
  
pengumuman.innerHTML = `
<div class="modal fade" id="modaleditpengumuman${doc.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Menambahkan Pengumuman Terbaru</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
        <div class="data-pengumuman">
        <div id="judul-pengumuman-body${doc.id}" class="judul-pengumuman-body">${judul}</div>
        <div class="keterangan-pengumuman-body">${tanggal}, <span id="keterangan-pengumuman-body${doc.id}">${keterangan}</span></div>
        <div id="edit${doc.id}" class="btn btn-warning edittransaksi">Edit Data Pengumuman</div>
        <div id="hapus${doc.id}" class="btn btn-danger hapustransaksi">Hapus Data Pengumuman</div>
        </div>
          <form id="form-edit-pengumuman${doc.id}" class="form-edit-pengumuman">
                <div class="form-group">
                  <label class="col-form-label">Judul</label>
                  <input type="text" class="form-control" value="${judul}" id="editjudulpengumuman${doc.id}" minlength="10" maxlength="20" autocomplete="off" required>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Keterangan</label>
                  <textarea oninput="auto_grow(this)" class="form-control" id="editketeranganpengumuman${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off" required>${keterangan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Sifat <small>(Note: Tidak wajib untuk diisi)</small></label>
                  <select class="form-control" id="editsifatpengumuman${doc.id}">
                    <option value="" disabled selected hidden>-</option>
                    <option>Penting</option>
                  </select>
                </div>
                    <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button id="submit" type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                  </form>
                <div class="garis"></div>          
            </div>
          </div>
       </div>
     </div>
`


    isiPengumuman.insertBefore(div,isiPengumuman.childNodes[0])
    editPengumuman.appendChild(pengumuman);

    let selectSifatPengumuman = document.querySelector('#editsifatpengumuman' + doc.id);
    let optionSifatPengumuman;
    for(let x = 0; x<selectSifatPengumuman.options.length; x++){
    optionSifatPengumuman = selectSifatPengumuman.options[x];
    if(optionSifatPengumuman.value == sifat){
        optionSifatPengumuman.setAttribute('selected', 'selected');
        }
    }

    if(sifat == "Penting"){
        document.querySelector('#badge' + doc.id).style.display = "inline-block";
    }

    let edit = document.querySelector('#edit' + doc.id);
    edit.addEventListener('click', function(e){
        e.preventDefault();
        let formEdit = document.querySelector('#form-edit-pengumuman' + doc.id);
        formEdit.style.display = "block";
        formEdit.addEventListener('submit', function(e){
            e.preventDefault();
            let judulUpdate = document.querySelector('#editjudulpengumuman' + doc.id).value;
            let sifatUpdate = document.querySelector('#editsifatpengumuman' + doc.id).value;
            let keteranganUpdate = document.querySelector('#editketeranganpengumuman' + doc.id).value;
            db.collection('pengumuman').doc(doc.id).update({
                judul : judulUpdate,
                sifat : sifatUpdate,
                keterangan : keteranganUpdate.replace(/\n\r?/g, '<br/>')
            }).then(() => {
                formEdit.style.display = "none";
            })
        })
    })

    let hapus = document.querySelector('#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus pengumuman ini?');
    if(konfirmasi == true){
    let id = document.querySelector('.dokumentasi-pengumuman' + doc.id).getAttribute('data-id');
    db.collection('pengumuman').doc(id).delete();
    $('#modaleditpengumuman' + doc.id).modal('hide');
        }
    })
}

function renderEditPengumuman(doc){
    let judul = doc.data().judul;
    let keterangan = doc.data().keterangan;
    let sifat = doc.data().sifat;
    document.querySelector('#judul-pengumuman' + doc.id).innerHTML = judul;
    document.querySelector('#judul-pengumuman-body' + doc.id).innerHTML = judul;
    document.querySelector('#keterangan-pengumuman' + doc.id).innerHTML = keterangan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;");
    document.querySelector('#keterangan-pengumuman-body' + doc.id).innerHTML = keterangan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;");

        if(sifat == "Penting"){
        document.querySelector('#badge' + doc.id).style.display = "inline-block";
        } else {
        document.querySelector('#badge' + doc.id).style.display = "none";
    }
}


const createForm = document.querySelector('#tambah-pengumuman');

createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    tanggal = dd + '/' + mm + '/' + yyyy;
    jam = hours + ":" + minutes;
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
        } else if(change.type == 'modified'){
            renderEditCatatan(change.doc);
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
    <div class="judul-daftar-catatan">Catatan @<span id="creator-catatan${doc.id}">${creatorCatatan}</span></div>
    <small class="text-light">Dibuat pada ${tanggalCatatan}</small></div>
    <div id="keterangan-catatan${doc.id}" class="keterangan-catatan">${keteranganCatatan}</div>
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
                <div class="garis"></div>
            </div>
        </div>
    </div>
</div>
    `

    isiCatatan.insertBefore(div,isiCatatan.childNodes[0])
    editCatatan.appendChild(edit);

        if(isiCatatan.childNodes.length == 0){
            document.querySelector('#jumlahcatatan').innerText = '';
        }else if(isiCatatan.childNodes.length != 0){
            let badgeJumlahCatatan = isiCatatan.childNodes.length;
            document.querySelector('#jumlahcatatan').innerText = badgeJumlahCatatan;
        }else if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahinformasi').innerText = '';
        }else{
            let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
            document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
            }

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
        })
    })

        let hapus = document.querySelector('a#hapusya' + doc.id);
        hapus.addEventListener('click', function(e){
        e.stopPropagation();
        let konfirmasi = confirm('Anda yakin ingin menghapus catatan ini?');
        if(konfirmasi == true){
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('catatan').doc(id).delete();
        if(isiCatatan.childNodes.length == 0){
            document.querySelector('#jumlahcatatan').innerText = '';
        }else if(isiCatatan.childNodes.length != 0){
            let badgeJumlahCatatan = isiCatatan.childNodes.length;
            document.querySelector('#jumlahcatatan').innerText = badgeJumlahCatatan;
        }else if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahinformasi').innerText = '';
        }else{
            let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
            document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
            }
    }
 })
} 


function renderEditCatatan(doc){
    let keteranganCatatan = doc.data().keteranganCatatan;
    let creatorCatatan = doc.data().creatorCatatan;
    document.querySelector('#keterangan-catatan' + doc.id).innerHTML = keteranganCatatan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;");
    document.querySelector('#creator-catatan' + doc.id).innerHTML = creatorCatatan;
}
       

const createForm1 = document.querySelector('#tambah-catatan');

createForm1.addEventListener('submit', (e) => {
    e.preventDefault();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    tanggal = dd + '/' + mm + '/' + yyyy;
    jam = hours + ":" + minutes;
    db.collection('catatan').add({
        keteranganCatatan: createForm1['keterangancatatan'].value.replace(/\n\r?/g, '<br/>'),
        tanggalCatatan: tanggal + ', '+ jam,
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
        } else if(change.type == 'modified'){
            renderEditPromo(change.doc);
        }
    })
})




const isiPromo = document.querySelector('#isipromo');
const editPromo = document.querySelector('#editpromo');


function renderPromo(doc){
    let div = document.createElement('div');
    let edit = document.createElement('div');
    let bulanPromo = doc.data().bulanPromo;
    let brandPromo = doc.data().brandPromo;
    let keteranganPromo = doc.data().keteranganPromo;
    let tanggalMulaiPromo = doc.data().tanggalMulaiPromo;
    let tanggalAkhirPromo = doc.data().tanggalAkhirPromo;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    tanggal = yyyy + '-' + mm + '-' + dd;
    div.setAttribute('data-id', doc.id);
    div.style.margin = "0px 0px 8px";
    div.innerHTML= `
<div class="card">
        <button class="btn btn-link card-header bg-dark" type="button" data-toggle="collapse" data-target="#collapse${doc.id}" aria-expanded="true" aria-controls="collapse${doc.id}">
          Promo <span id="brand-promo${doc.id}">${brandPromo}</span> Bulan <span id="bulan-promo${doc.id}">${bulanPromo}</span> <span class="expired" id="expired${doc.id}">Expired</span>
        </button>
    <div id="collapse${doc.id}" class="collapse">
      <div class="keterangan-promo card-body">
    <span id="keterangan-promo${doc.id}">${keteranganPromo}</span><br>
    <div class="notes">Notes : Format YYYY/MM/DD</div>
    <div class="notes"><span id="tanggal-mulai-promo${doc.id}">${tanggalMulaiPromo}</span> s.d  <span id="tanggal-akhir-promo${doc.id}">${tanggalAkhirPromo}</span></div>
      </div>
    </div>
</div>
<a id="editya${doc.id}" class="editya" data-toggle="modal" data-target="#modaleditpromo${doc.id}"><i class='fas fa-edit'></i> Edit</a><a class="hapusya" id="hapus-promo${doc.id}"><i class='fas fa-trash-alt'></i> Hapus</a>
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
                  <textarea oninput="auto_grow(this)" onfocus="auto_grow(this)" class="form-control" id="editketeranganpromo${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off" required>${keteranganPromo.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
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

    

    isiPromo.insertBefore(div,isiPromo.childNodes[0])
    editPromo.appendChild(edit);

        if(isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahpromo').innerText = '';
        }else if(isiPromo.childNodes.length != 0){
            let badgeJumlahPromo = isiPromo.childNodes.length;
            document.querySelector('#jumlahpromo').innerText = badgeJumlahPromo;
        }else if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahinformasi').innerText = '';
        }else{
            let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
            document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
            }


    let formEditPromo = document.querySelector('#form-edit-promo' + doc.id);
    formEditPromo.addEventListener('submit', (e) => {
        e.preventDefault();
    let updateBrandPromo = document.querySelector('#editbrandpromo' + doc.id).value;
    let updateKeteranganPromo = document.querySelector('#editketeranganpromo' + doc.id).value;
    let updateTanggalMulaiPromo = document.querySelector('#edittanggalmulaipromo' + doc.id).value;
    let updateTanggalAkhirPromo = document.querySelector('#edittanggalakhirpromo' + doc.id).value;
    let month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    let mulai = new Date(updateTanggalMulaiPromo);
    let akhir = new Date(updateTanggalAkhirPromo);
    mulai.setDate(mulai.getDate()+7);
    akhir.setDate(akhir.getDate()-7);
    let bulanmulai = month[mulai.getMonth()];
    let bulanakhir = month[akhir.getMonth()];
    if(bulanmulai == bulanakhir){
    let bulanPromo = bulanmulai;
    db.collection('promo').doc(doc.id).update({
        bulanPromo: bulanPromo,
        brandPromo : updateBrandPromo,
        keteranganPromo : updateKeteranganPromo.replace(/\n\r?/g, '<br/>'),
        tanggalMulaiPromo : updateTanggalMulaiPromo,
        tanggalAkhirPromo : updateTanggalAkhirPromo
    }).then(() => {
        document.querySelector('#tambah-promo').reset();
        })
    } else {
        alert('Pastikan promo brand tersebut berlaku sekitar 1 bulan, jika promo brand tersebut diperpanjang maka dimohon untuk diedit ulang kembali periode tanggalnya.');
    }
})

        let hapus = document.querySelector('#hapus-promo' + doc.id);
        hapus.addEventListener('click', function(e){
        e.stopPropagation();
        let konfirmasi = confirm('Anda yakin ingin menghapus promo ini?');
        if(konfirmasi == true){
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('promo').doc(id).delete();
        if(isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahpromo').innerText = '';
        }else if(isiPromo.childNodes.length != 0){
            let badgeJumlahPromo = isiPromo.childNodes.length;
            document.querySelector('#jumlahpromo').innerText = badgeJumlahPromo;
        }else if(isiCatatan.childNodes.length == 0 && isiPromo.childNodes.length == 0){
            document.querySelector('#jumlahinformasi').innerText = '';
        }else{
            let badgeJumlahInformasi = isiCatatan.childNodes.length + isiPromo.childNodes.length;
            document.querySelector('#jumlahinformasi').innerText = badgeJumlahInformasi;
            }
        }
    })


    if(tanggalAkhirPromo == tanggal){
    document.querySelector('#expired' + doc.id).style.display = 'block';
        }

}

function renderEditPromo(doc){
    let bulanPromo = doc.data().bulanPromo;
    let brandPromo = doc.data().brandPromo;
    let keteranganPromo = doc.data().keteranganPromo;
    let tanggalMulaiPromo = doc.data().tanggalMulaiPromo;
    let tanggalAkhirPromo = doc.data().tanggalAkhirPromo;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    tanggal = yyyy + '-' + mm + '-' + dd;
    document.querySelector('#bulan-promo' + doc.id).innerHTML = bulanPromo;
    document.querySelector('#brand-promo' + doc.id).innerHTML = brandPromo;
    document.querySelector('#keterangan-promo' + doc.id).innerHTML = keteranganPromo.replace(/<br\s*[\/]?>/gi, "&#13;&#10;");
    document.querySelector('#tanggal-mulai-promo' + doc.id).innerHTML = tanggalMulaiPromo;
    document.querySelector('#tanggal-akhir-promo' + doc.id).innerHTML = tanggalAkhirPromo;
    if(tanggalAkhirPromo == tanggal){
    document.querySelector('#expired' + doc.id).style.display = 'block';
        }
}

const createForm2 = document.querySelector('#tambah-promo');

createForm2.addEventListener('submit', (e) => {
    e.preventDefault();
    let tanggalMulaiPromo = document.querySelector('#tanggalmulaipromo').value;
    let tanggalAkhirPromo = document.querySelector('#tanggalakhirpromo').value;
    let month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    let mulai = new Date(tanggalMulaiPromo);
    let akhir = new Date(tanggalAkhirPromo);
    mulai.setDate(mulai.getDate()+7);
    akhir.setDate(akhir.getDate()-7);
    let bulanmulai = month[mulai.getMonth()];
    let bulanakhir = month[akhir.getMonth()];
if(bulanmulai == bulanakhir){
    let bulanPromo = bulanmulai;
    db.collection('promo').add({
        bulanPromo: bulanPromo,
        brandPromo: createForm2['brandpromo'].value,
        keteranganPromo: createForm2['keteranganpromo'].value.replace(/\n\r?/g, '<br/>'),
        tanggalMulaiPromo : createForm2['tanggalmulaipromo'].value,
        tanggalAkhirPromo : createForm2['tanggalakhirpromo'].value
    }).then(() => {
        $('#modalpromo').modal('hide');
        document.querySelector('#tambah-promo').reset();
        })
    } else {
        alert('Pastikan promo brand tersebut berlaku sekitar 1 bulan');
    }
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
        } else if(change.type == 'modified'){
            renderEditCustomer(change.doc);
        }
    })
})



const isiCustomer = document.querySelector('#isicust');
const editCust = document.querySelector('#editcust');

function renderCustomer(doc){
    let div = document.createElement('div');
    let edit = document.createElement('div');
    div.setAttribute('data-id', doc.id);
    let namaCust = doc.data().namaCust;
    let kontakCust = doc.data().kontakCust;
    let daftarProduk = doc.data().daftarProduk;
    let sifatTransaksi = doc.data().sifatTransaksi;
    let emailCust = doc.data().emailCust;
    let tanggalCust = new Date(doc.data().tanggalCust);
    let dd = String(tanggalCust.getDate()).padStart(2, '0');
    let mm = String(tanggalCust.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = tanggalCust.getFullYear();
    let hours = ('0' + tanggalCust.getHours()).slice(-2);
    let minutes = ('0' + tanggalCust.getMinutes()).slice(-2);
    let tanggal = dd + '/' + mm + '/' + yyyy + ', ';
    if(tanggal == "NaN/NaN/NaN, "){
        tanggal = '';
    }
    div.innerHTML=`
    <div class="card">
        <button class="btn btn-link card-header bg-dark" type="button" data-toggle="collapse" data-target="#collapse${doc.id}" aria-expanded="true" aria-controls="collapse${doc.id}">
          <div class="judul-keterangan-cust" id="judul-keterangan-cust${doc.id}">
          <div><span id="sifat-transaksi${doc.id}">${tanggal} ${sifatTransaksi}</span> Produk</div>
          <div>:</div>
          <div id="daftar-produk${doc.id}">${daftarProduk}</div>
          </div>
        </button>
    <div id="collapse${doc.id}" class="collapse">
      <div class="card-body keterangan-cust">
    <div class="isi-keterangan-cust">
    <div>Nama Customer</div>
    <div>:</div>
    <div id="nama-cust-body${doc.id}">${namaCust}</div>
    <div>Kontak Customer</div>
    <div>:</div> 
    <div id="kontak-cust${doc.id}">${kontakCust}</div>
    <div>Email Customer</div>
    <div>:</div>
    <div id="email-cust${doc.id}">${emailCust}</div>
    <div>Produk yang dicari</div>
    <div>:</div>
    <div id="daftar-produk-body${doc.id}">${daftarProduk}</div>
        </div>
      </div>
    </div>
</div>
<a id="editya${doc.id}" class="editya" data-toggle="modal" data-target="#modaleditcust${doc.id}"><i class='fas fa-edit'></i> Edit</a><a class="hapusya" style="margin-bottom:8px;" id="hapus-cust${doc.id}"><i class='fas fa-trash-alt'></i> Hapus</a>
    `
    edit.innerHTML=`
<div class="modal fade" id="modaleditcust${doc.id}" tabindex="-1" role="dialog" aria-labelledby="modalcust" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="labelmodalcust">Menambahkan Data Customer Terbaru</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
          <form id="form-edit-cust${doc.id}">
            <div class="row">
                <div class="form-group col-6">
                  <label class="col-form-label">Nama Customer</label>
                  <input type="text" value="${namaCust}" class="form-control" id="editnamacust${doc.id}" autocomplete="off" placeholder="Cantumkan Nama Customer" required>
                </div>
                <div class="form-group col">
                  <label class="col-form-label">Kontak Customer</label>
                  <input type="number" value="${kontakCust}" class="form-control your_class" id="editkontakcust${doc.id}" autocomplete="off" placeholder="e.g. 081234567890" autocomplete="off" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
    maxlength = "13" required>
                </div>
             </div>
                <div class="form-group">
                  <label class="col-form-label">Daftar Produk</label>
                  <textarea oninput="auto_grow(this)" onfocus="auto_grow(this)" class="form-control" id="editdaftarproduk${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off" required>${daftarProduk.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
              <div class="row">
                <div class="form-group col-6">
                  <label class="col-form-label">Email Customer<small> (Notes : Tidak wajib untuk diisi)</small></label>
                  <input type="email" value="${emailCust}" class="form-control" id="editemailcust${doc.id}" placeholder="google@example.com" autocomplete="off">
                </div>
                <div class="form-group col-6">
                  <label class="col-form-label">Penawaran/Indent</label>
                  <select class="form-control" id="editsifattransaksi${doc.id}" required>
                    <option value="" disabled selected hidden>-</option>
                    <option>Penawaran</option>
                    <option>Indent</option>
                  </select>
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
     </div>
    `
    isiCustomer.appendChild(div);
    editCust.appendChild(edit);

if(emailCust == ""){
    document.querySelector('#email-cust' + doc.id).innerText = "Tidak ada";
}

if(isiCustomer.childNodes.length == 0){
    document.querySelector('#jumlahcust').innerText = '';
}else{
    let badgeJumlahCustomer = isiCustomer.childNodes.length;
    document.querySelector('#jumlahcust').innerText = badgeJumlahCustomer;
}

    if(tanggal == ''){
        document.querySelector('#judul-keterangan-cust' + doc.id).style.gridTemplateColumns = "140px 10px auto"
    }

let selectSifatTransaksi = document.querySelector('#editsifattransaksi' + doc.id);
let optionSifatTransaksi;
for(let x = 0; x<selectSifatTransaksi.options.length; x++){
    optionSifatTransaksi = selectSifatTransaksi.options[x];
    if(optionSifatTransaksi.value == sifatTransaksi){
        optionSifatTransaksi.setAttribute('selected', 'selected');
        }
    }

let formEditCustomer = document.querySelector('#form-edit-cust' + doc.id);
    formEditCustomer.addEventListener('submit', (e) => {
        e.preventDefault();
    let updateTanggalCust = tanggal;
    let updateNamaCust = document.querySelector('#editnamacust' + doc.id).value;
    let updateKontakCust = document.querySelector('#editkontakcust' + doc.id).value;
    let updateDaftarProduk = document.querySelector('#editdaftarproduk' + doc.id).value;
    let updateSifatTransaksi = document.querySelector('#editsifattransaksi' + doc.id).value;
    let updateEmailCust = document.querySelector('#editemailcust' + doc.id).value;
    db.collection('customer').doc(doc.id).update({
    namaCust: updateNamaCust,
    kontakCust: updateKontakCust,
    daftarProduk : updateDaftarProduk.replace(/\n\r?/g, '<br/>'),
    sifatTransaksi: updateSifatTransaksi,
    emailCust : updateEmailCust,
    tanggalCust : updateTanggalCust
    }).then(() => {
        $('#modaleditcust' + doc.id).modal('hide');
        })
    })


    let hapus = document.querySelector('#hapus-cust' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus data ini?');
    if(konfirmasi == true){
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('customer').doc(id).delete();
    if(isiCustomer.childNodes.length == 0){
    document.querySelector('#jumlahcust').innerText = '';
    }else{
    let badgeJumlahCustomer = isiCustomer.childNodes.length;
    document.querySelector('#jumlahcust').innerText = badgeJumlahCustomer;
        }
     }
  })
}

function renderEditCustomer(doc){
    let namaCust = doc.data().namaCust;
    let kontakCust = doc.data().kontakCust;
    let daftarProduk = doc.data().daftarProduk;
    let sifatTransaksi = doc.data().sifatTransaksi;
    let emailCust = doc.data().emailCust;
    let tanggalCust = doc.data().tanggalCust;
    document.querySelector('#nama-cust-body' + doc.id).innerHTML = namaCust;
    document.querySelector('#kontak-cust' + doc.id).innerHTML = kontakCust;
    document.querySelector('#daftar-produk' + doc.id).innerHTML = daftarProduk;
    document.querySelector('#daftar-produk-body' + doc.id).innerHTML = daftarProduk;
    document.querySelector('#sifat-transaksi' + doc.id).innerText = tanggalCust + ' ' + sifatTransaksi;
    document.querySelector('#email-cust' + doc.id).innerHTML = emailCust;

let selectSifatTransaksi = document.querySelector('#editsifattransaksi' + doc.id);
let optionSifatTransaksi;
for(let x = 0; x<selectSifatTransaksi.options.length; x++){
    optionSifatTransaksi = selectSifatTransaksi.options[x];
    if(optionSifatTransaksi.value == sifatTransaksi){
        optionSifatTransaksi.setAttribute('selected', 'selected');
        }
    }

    if(emailCust == ""){
    document.querySelector('#email-cust' + doc.id).innerText = "Tidak ada";
}

}


const createForm4 = document.querySelector('#tambah-cust');

createForm4.addEventListener('submit', (e) => {
    e.preventDefault();
    let tanggal = new Date().getTime();
    db.collection('customer').add({
        namaCust: createForm4['namacust'].value,
        kontakCust: createForm4['kontakcust'].value,
        daftarProduk : createForm4['daftarproduk'].value.replace(/\n\r?/g, '<br/>'),
        sifatTransaksi: createForm4['sifattransaksi'].value,
        emailCust : createForm4['emailcust'].value,
        tanggalCust : tanggal
    }).then(() => {
        $('#modalcust').modal('hide')
        const selectbox = document.querySelector('#sifattransaksi');
        document.querySelector('#tambah-cust').reset();
        selectbox.selectedIndex = null;

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
    let items = $('#daftar-tugas-selesai > .tugas-selesai').get();
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
    let items = $('#daftar-tugas-pending > .tugas-pending').get();
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


    db.collection('transaksi').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                renderTransaksi(change.doc);
            }else if (change.type == 'removed'){
                let div = document.querySelector('[data-id="' + change.doc.id + '"]');
                isiTransaksi.removeChild(div);
            } else if(change.type == 'modified'){
                renderUpdateTransaksi(change.doc);
            }
        })
    })

const isiTransaksi = document.querySelector('#list-transaksi')
const modalTransaksi = document.querySelector('#list-modal-transaksi')

function renderTransaksi(doc){
    let tr = document.createElement('tr');
    let transaksi = document.createElement('div');
    let tanggal = doc.data().tanggal;
    console.log(tanggal)
    let kalkulasiTanggal = new Date(tanggal);
    let dd = String(kalkulasiTanggal.getDate()).padStart(2, '0');
    let mm = String(kalkulasiTanggal.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = kalkulasiTanggal.getFullYear();
    tanggal = dd + '/' + mm + '/' + yyyy;
    let sortir = tanggal.split('/');
    let sortirTanggal = sortir[2] + sortir[1] + sortir[0]
    tr.setAttribute('data-date', sortirTanggal);
    let tampilantanggal = yyyy + '-' + mm + '-' + dd
    let customer = doc.data().customer;
    let nominal = doc.data().nominal;
    let produk = doc.data().produk;
    let keterangan = doc.data().keterangan;
    tr.setAttribute('data-id', doc.id);
    tr.setAttribute('data-toggle', 'modal');
    tr.setAttribute('data-target', '#modalupdatetransaksi' + doc.id);
    tr.setAttribute('id','transaksi' + doc.id);
    tr.classList.add('dokumentasi-transaksi' + doc.id, 'transaksi');
    tr.innerHTML = `
    <td style="font-weight:bold;vertical-align:middle;text-align:center;" id="tanggal-table${doc.id}" class="tanggal-table">${tanggal}</td>
    <td style="vertical-align:middle;text-align:center;" id="customer-table${doc.id}">${customer}</td>
    <td style="vertical-align:middle;text-align:center;" id="nominal-table${doc.id}">${"Rp." + Number(nominal).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ",00"}</td>
    <td style="vertical-align:middle;" id="produk-table${doc.id}">${produk}</td>
    <td style="vertical-align:middle;text-align:center;" id="keterangan-table${doc.id}">${keterangan}</td>
    `
    transaksi.innerHTML = `
<div class="modal fade" id="modalupdatetransaksi${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Pengaturan Transaksi</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
        <div class="data-transaksi">
        <div class="info-transaksi">
        <div>Tanggal Transaksi</div>
        <div>:</div>
        <div style="font-weight:bold;" id="tanggal-transaksi${doc.id}">${tanggal}</div>
        <div>Nama Customer</div>
        <div>:</div>        
        <div id="customer-transaksi${doc.id}">${customer}</div>
        <div>Nominal Transaksi</div>
        <div>:</div> 
        <div id="nominal-transaksi${doc.id}">${"Rp." + Number(nominal).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ",00"}</div>
        <div>Produk</div>
        <div>:</div> 
        <div id="produk-transaksi${doc.id}">${produk}</div>
        <div>Keterangan Transaksi</div>
        <div>:</div> 
        <div id="keterangan-transaksi${doc.id}">${keterangan}</div>
        </div>
        <div id="edit${doc.id}" class="btn btn-warning edittransaksi">Edit Data Transaksi</div>
        <div id="hapus${doc.id}" class="btn btn-danger hapustransaksi">Hapus Data Transaksi</div>
        </div>
          <form id="modal-transaksi${doc.id}" class="modal-transaksi">
            <div class="form-group">
                  <label class="col-form-label">Tanggal Transaksi <small>(Note :Tanggal transaksi akan otomatis mengikuti tanggal perubahan jika kolom dikosongkan)</small></label>
                  <input type="date" value="${tampilantanggal}" class="form-control" id="tanggal-transaksi-update${doc.id}" autocomplete="off">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Nama Customer</label>
                  <input type="text" value="${customer}" class="form-control your_class" id="customer-transaksi-update${doc.id}" autocomplete="off" autocomplete="off">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Nominal Transaksi</label>
                  <input type="number" value="${nominal}" class="form-control your_class" id="nominal-transaksi-update${doc.id}" autocomplete="off" autocomplete="off">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Produk</label>
                  <textarea oninput="auto_grow(this)" onfocus="auto_grow(this)" class="form-control" id="produk-transaksi-update${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off">${produk.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Keterangan Transaksi</label>
                  <textarea oninput="auto_grow(this)" onfocus="auto_grow(this)" class="form-control" id="keterangan-transaksi-update${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off">${keterangan.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
            <div class="garis"></div>
            </div>
          </div>
       </div>
     </div>
    `

isiTransaksi.insertBefore(tr,isiTransaksi.childNodes[0]);
modalTransaksi.appendChild(transaksi);

    let edit = document.querySelector('#edit' + doc.id);
    edit.addEventListener('click', function(e){
        e.preventDefault();
        let formEdit = document.querySelector('#modal-transaksi' + doc.id);
        formEdit.style.display = "block";
        formEdit.addEventListener('submit', function(e){
            e.preventDefault();
            let tanggalUpdate = document.querySelector('#tanggal-transaksi-update' + doc.id).value;
            let customerUpdate = document.querySelector('#customer-transaksi-update' + doc.id).value;
            let nominalUpdate = document.querySelector('#nominal-transaksi-update' + doc.id).value;
            let produkUpdate = document.querySelector('#produk-transaksi-update' + doc.id).value;
            let keteranganUpdate = document.querySelector('#keterangan-transaksi-update' + doc.id).value;
if(tanggalUpdate == 0){
    tanggalUpdate = new Date().getTime();
}
            db.collection('transaksi').doc(doc.id).update({
                tanggal : tanggalUpdate,
                customer : customerUpdate,
                nominal : nominalUpdate,
                produk : produkUpdate,
                keterangan : keteranganUpdate
            }).then(() => {
                formEdit.style.display = "none";
            })
        })
    })

    $(document).ready(function() {
    db.collection('transaksi').onSnapshot(snapshot =>{
    let items = $('#list-transaksi > .transaksi').get();
    items.sort(function(a, b) {
    var keyA = $(a).data('date');
    var keyB = $(b).data('date');
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
    })
    var daftarTransaksi = $('#list-transaksi');
    $.each(items, function(i, div) {
    daftarTransaksi.append(div);
  })
  })
})

    let hapus = document.querySelector('#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus data transaksi ini?');
    if(konfirmasi == true){
    let id = document.querySelector('.dokumentasi-transaksi' + doc.id).getAttribute('data-id');
    db.collection('transaksi').doc(id).delete();
    $('#modalupdatetransaksi' + doc.id).modal('hide');
        }
    })

}

function renderUpdateTransaksi(doc){
    let tanggal = doc.data().tanggal;
    let kalkulasiTanggal = new Date(tanggal);
    let dd = String(kalkulasiTanggal.getDate()).padStart(2, '0');
    let mm = String(kalkulasiTanggal.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = kalkulasiTanggal.getFullYear();
    tanggal = dd + '/' + mm + '/' + yyyy;
    let tr = document.querySelector('#transaksi' + doc.id);
    let sortir = tanggal.split('/');
    let sortirTanggal = sortir[2] + sortir[1] + sortir[0]
    tr.setAttribute('data-date', sortirTanggal);   
    let customer = doc.data().customer;
    let nominal = doc.data().nominal;
    let produk = doc.data().produk;
    let keterangan = doc.data().keterangan;
    document.querySelector('#tanggal-table' + doc.id).innerText = tanggal;
    document.querySelector('#tanggal-transaksi' + doc.id).innerText = tanggal;
    document.querySelector('#customer-table' + doc.id).innerText = customer;
    document.querySelector('#customer-transaksi' + doc.id).innerText = customer;
    document.querySelector('#nominal-table' + doc.id).innerText = "Rp." + Number(nominal).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ",00";
    document.querySelector('#nominal-transaksi' + doc.id).innerText = "Rp." + Number(nominal).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ",00";
    document.querySelector('#produk-table' + doc.id).innerText = produk;
    document.querySelector('#produk-transaksi' + doc.id).innerText = produk;
    document.querySelector('#keterangan-table' + doc.id).innerText = keterangan;
    document.querySelector('#keterangan-transaksi' + doc.id).innerText = keterangan;
    

}


const createForm9 = document.querySelector('#tambah-transaksi');
createForm9.addEventListener('submit', (e) => {
    e.preventDefault();
    if(document.querySelector('#tanggal-transaksi').value == 0){
    let tanggal = new Date().getTime();
    if(document.querySelector('#nominal-transaksi').value == 0){
        alert("Pastikan anda mengisi kolom nominal transaksi")
    } else {
    db.collection('transaksi').add({
        tanggal: tanggal,
        customer: createForm9['customer-transaksi'].value,
        nominal: createForm9['nominal-transaksi'].value,
        produk: createForm9['produk-transaksi'].value.replace(/\n\r?/g, '<br/>'),
        keterangan: createForm9['keterangan-transaksi'].value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modaltransaksi').modal('hide');
        document.querySelector('#tambah-transaksi').reset();
    })
   }
  } else {
    if(document.querySelector('#nominal-transaksi').value == 0){
        alert("Pastikan anda mengisi kolom nominal transaksi")
    } else {
    db.collection('transaksi').add({
        tanggal: createForm9['tanggal-transaksi'].value,
        customer: createForm9['customer-transaksi'].value,
        nominal: createForm9['nominal-transaksi'].value,
        produk: createForm9['produk-transaksi'].value.replace(/\n\r?/g, '<br/>'),
        keterangan: createForm9['keterangan-transaksi'].value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modaltransaksi').modal('hide');
        document.querySelector('#tambah-transaksi').reset();
    })
   }
  }
})


    db.collection('produk').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                renderBarangDicari(change.doc);
            }else if (change.type == 'removed'){
                let div = document.querySelector('[data-id="' + change.doc.id + '"]');
                isiBarangDicari.removeChild(div);
            } else if(change.type == 'modified'){
                renderUpdateBarangDicari(change.doc);
            }
        })
    })


const isiBarangDicari = document.querySelector('#list-barang-dicari')
const modalBarangDicari = document.querySelector('#list-modal-barang-dicari')

function renderBarangDicari(doc){
    let tr = document.createElement('tr');
    let barangDicari = document.createElement('div');
    let tanggal = doc.data().tanggal;
    let kalkulasiTanggal = new Date(tanggal);
    let dd = String(kalkulasiTanggal.getDate()).padStart(2, '0');
    let mm = String(kalkulasiTanggal.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = kalkulasiTanggal.getFullYear();
    tanggal = dd + '/' + mm + '/' + yyyy;
    let sortir = tanggal.split('/');
    let sortirTanggal = sortir[2] + sortir[1] + sortir[0]
    tr.setAttribute('data-date', sortirTanggal);
    let produk = doc.data().produk;
    let pelapor = doc.data().pelapor;
    tr.setAttribute('data-id', doc.id);
    tr.setAttribute('data-toggle', 'modal');
    tr.setAttribute('data-target', '#modalupdatebarangdicari' + doc.id);
    tr.setAttribute('id','barangdicari' + doc.id);
    tr.classList.add('dokumentasi-barang-dicari' + doc.id, 'barangdicari');
    tr.innerHTML = `
    <td style="font-weight:bold;vertical-align:middle;text-align:center;" id="tanggal-table${doc.id}" class="tanggal-table">${tanggal}</td>
    <td style="vertical-align:middle;text-align:center;" id="pelapor-table${doc.id}">${pelapor}</td>
    <td style="vertical-align:middle;" id="produk-table${doc.id}">${produk}</td>
    `
    barangDicari.innerHTML = `
<div class="modal fade" id="modalupdatebarangdicari${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Pengaturan Data Produk yang dicari</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
        <div class="data-barang-dicari">
        <div class="info-barang-dicari">
        <div>Tanggal</div>
        <div>:</div>
        <div style="font-weight:bold;" id="tanggal-barang-dicari${doc.id}">${tanggal}</div>
        <div>Pelapor</div>
        <div>:</div>        
        <div id="pelapor-barang-dicari${doc.id}">${pelapor}</div>
        <div>Produk</div>
        <div>:</div> 
        <div id="produk-barang-dicari${doc.id}">${produk}</div>
        </div>
        <div id="edit${doc.id}" class="btn btn-warning editbarangdicari">Edit Data Produk yang dicari</div>
        <div id="hapus${doc.id}" class="btn btn-danger hapusbarangdicari">Hapus Data Produk yang dicari</div>
        </div>
          <form id="modal-barang-dicari${doc.id}" class="modal-barang-dicari">
                <div class="form-group">
                  <label>Pelapor</label>
                <select class="form-control" id="pelapor-update${doc.id}" required>
                    <option value="" disabled selected hidden>-</option>
                    <option>Admin Galaxy</option>
                    <option>Toko Tangerang</option>
                    <option>Toko Depok</option>
                    <option>Toko Jaksel</option>
                    <option>Toko Senen</option>
                    </select>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Produk yang dicari</label>
                  <textarea oninput="auto_grow(this)" class="form-control" id="barang-dicari-update${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off">${produk.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
            <div class="garis"></div>
            </div>
          </div>
       </div>
     </div>
    `

isiBarangDicari.appendChild(tr);
modalBarangDicari.appendChild(barangDicari);

    let selectPelapor = document.querySelector('#pelapor-update' + doc.id);
    let optionPelapor;
    for(let x = 0; x<selectPelapor.options.length; x++){
    optionPelapor = selectPelapor.options[x];
    if(optionPelapor.value == pelapor){
        optionPelapor.setAttribute('selected', 'selected');
        }
    }


    let edit = document.querySelector('#edit' + doc.id);
    edit.addEventListener('click', function(e){
        e.preventDefault();
        let formEdit = document.querySelector('#modal-barang-dicari' + doc.id);
        formEdit.style.display = "block";
        formEdit.addEventListener('submit', function(e){
            e.preventDefault();
            let tanggalUpdate = tanggal;
            console.log(tanggal);
            let pelaporUpdate = document.querySelector('#pelapor-update' + doc.id).value;
            let produkUpdate = document.querySelector('#barang-dicari-update' + doc.id).value;
            db.collection('produk').doc(doc.id).update({
                tanggal : tanggalUpdate,
                pelapor : pelaporUpdate,
                produk : produkUpdate
            }).then(() => {
                formEdit.style.display = "none";
            })
        })
    })

    $(document).ready(function() {
    db.collection('produk').onSnapshot(snapshot =>{
    let items = $('#list-barang-dicari > .barangdicari').get();
    items.sort(function(a, b) {
    var keyA = $(a).data('date');
    var keyB = $(b).data('date');
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
    })
    var daftarBarangDicari = $('#list-barang-dicari');
    $.each(items, function(i, div) {
    daftarBarangDicari.append(div);
  })
  })
})

    let hapus = document.querySelector('#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus data produk yang dicari ini?');
    if(konfirmasi == true){
    let id = document.querySelector('.dokumentasi-barang-dicari' + doc.id).getAttribute('data-id');
    db.collection('produk').doc(id).delete();
    $('#modalupdatebarangdicari' + doc.id).modal('hide');
        }
    })

}

function renderUpdateBarangDicari(doc){
    let tanggal = doc.data().tanggal;
    let pelapor = doc.data().pelapor;
    let produk = doc.data().produk;
    document.querySelector('#tanggal-table' + doc.id).innerText = tanggal;
    document.querySelector('#tanggal-barang-dicari' + doc.id).innerText = tanggal;
    document.querySelector('#pelapor-table' + doc.id).innerText = pelapor;
    document.querySelector('#pelapor-barang-dicari' + doc.id).innerText = pelapor;
    document.querySelector('#produk-table' + doc.id).innerText = produk;
    document.querySelector('#produk-barang-dicari' + doc.id).innerText = produk;
    
}


const createForm10 = document.querySelector('#tambah-barang-dicari');
createForm10.addEventListener('submit', (e) => {
    e.preventDefault();
    let tanggal = new Date().getTime();
    db.collection('produk').add({
        tanggal: tanggal,
        pelapor: createForm10['pelapor'].value,
        produk: createForm10['barang-dicari'].value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modalbarangdicari').modal('hide');
        document.querySelector('#tambah-barang-dicari').reset();
    })
})





    db.collection('achievement').onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type == 'added'){
                renderAchievement(change.doc);
            }else if (change.type == 'removed'){
                let div = document.querySelector('[data-id="' + change.doc.id + '"]');
                isiAchievement.removeChild(div);
            } else if(change.type == 'modified'){
                renderUpdateAchievement(change.doc);
            }
        })
    })


const isiAchievement = document.querySelector('#list-achievement')
const modalAchievement = document.querySelector('#list-modal-achievement')

function renderAchievement(doc){
    let tr = document.createElement('tr');
    let achievement = document.createElement('div');
    let tanggal = doc.data().tanggal;
    let kalkulasiTanggal = new Date(tanggal);
    let dd = String(kalkulasiTanggal.getDate()).padStart(2, '0');
    let month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    let mm = month[kalkulasiTanggal.getMonth()];
    let yyyy = kalkulasiTanggal.getFullYear();
    tanggal = dd + ' ' + mm + ' ' + yyyy;
    let mmKedua = String(kalkulasiTanggal.getMonth() + 1).padStart(2, '0'); //January is 0!
    let tampilanTanggal = yyyy + '-' + mmKedua + '-' + dd
    let sortirTanggal = tampilanTanggal.split('-');
    tr.setAttribute('data-date', sortirTanggal);
    let kontenAchievement = doc.data().kontenAchievement;
    tr.setAttribute('data-id', doc.id);
    tr.setAttribute('data-toggle', 'modal');
    tr.setAttribute('data-target', '#modalupdateachievement' + doc.id);
    tr.setAttribute('id','achievement' + doc.id);
    tr.classList.add('dokumentasi-achievement' + doc.id, 'achievement');
    tr.innerHTML = `
    <td style="font-weight:bold;vertical-align:middle;text-align:center; id="tanggal-achievement-table${doc.id}" class="tanggal-table">${tanggal}</td>
    <td style="vertical-align:middle;" id="konten-achievement-table${doc.id}">${kontenAchievement}</td>
    `
    achievement.innerHTML = `
<div class="modal fade" id="modalupdateachievement${doc.id}" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Pengaturan Achievement</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
        <div class="modal-body">
        <div class="data-achievement">
        <div class="info-achievement">
        <div>Tanggal</div>
        <div>:</div>
        <div style="font-weight:bold;" id="tanggal-achievement${doc.id}">${tanggal}</div>
        <div>Konten Achievement</div>
        <div>:</div> 
        <div id="konten-achievement${doc.id}">${kontenAchievement}</div>
        </div>
        <div id="edit${doc.id}" class="btn btn-warning editachievement">Edit Data Achievement</div>
        <div id="hapus${doc.id}" class="btn btn-danger hapusachievement">Hapus Data Achievement</div>
        </div>
          <form id="modal-achievement${doc.id}" class="modal-achievement">
                <div class="form-group">
                  <label class="col-form-label">Tanggal Achievement <small>(Note :Tanggal achievement akan otomatis mengikuti tanggal hari ini jika kolom dikosongkan)</small></label>
                  <input type="date" class="form-control" value="${tampilanTanggal}" id="tanggal-achievement-update${doc.id}" autocomplete="off">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Konten Achievement</label>
                  <textarea oninput="auto_grow(this)" class="form-control" id="konten-achievement-update${doc.id}" style="display: block;overflow: hidden;resize: none;box-sizing: border-box;min-height:50px;" autocomplete="off">${kontenAchievement.replace(/<br\s*[\/]?>/gi, "&#13;&#10;")}</textarea>
                </div>
                <div class="modal-footer">
                      <button class="btn btn-danger" data-dismiss="modal">Tutup</button>
                      <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
            <div class="garis"></div>
            </div>
          </div>
       </div>
     </div>
    `

isiAchievement.appendChild(tr);
modalAchievement.appendChild(achievement);

let edit = document.querySelector('#edit' + doc.id);
    edit.addEventListener('click', function(e){
        e.preventDefault();
        let formEdit = document.querySelector('#modal-achievement' + doc.id);
        formEdit.style.display = "block";
        formEdit.addEventListener('submit', function(e){
            e.preventDefault();
            let tanggalUpdate = document.querySelector('#tanggal-achievement-update' + doc.id).value;
            let kontenAchievementUpdate = document.querySelector('#konten-achievement-update' + doc.id).value;
if(tanggalUpdate == 0){
    tanggalUpdate = new Date().getTime();
}
            db.collection('achievement').doc(doc.id).update({
                tanggal : tanggalUpdate,
                kontenAchievement : kontenAchievementUpdate
            }).then(() => {
                formEdit.style.display = "none";
            })
        })
    })

    $(document).ready(function() {
    db.collection('achievement').onSnapshot(snapshot =>{
    let items = $('#list-achievement > .achievement').get();
    items.sort(function(a, b) {
    var keyA = $(a).data('date');
    var keyB = $(b).data('date');
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
    })
    var daftarAchievement = $('#list-achievement');
    $.each(items, function(i, div) {
    daftarAchievement.append(div);
  })
  })
})


    let hapus = document.querySelector('#hapus' + doc.id);
    hapus.addEventListener('click', function(e){
    e.stopPropagation();
    let konfirmasi = confirm('Anda yakin ingin menghapus data achievement ini?');
    if(konfirmasi == true){
    let id = document.querySelector('.dokumentasi-achievement' + doc.id).getAttribute('data-id');
    db.collection('achievement').doc(id).delete();
    $('#modalupdateachievement' + doc.id).modal('hide');
        }
    })

}

function renderUpdateAchievement(doc){
    let tanggal = doc.data().tanggal;
    let kalkulasiTanggal = new Date(tanggal);
    let dd = String(kalkulasiTanggal.getDate()).padStart(2, '0');
    let month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    let mm = month[kalkulasiTanggal.getMonth()];
    let yyyy = kalkulasiTanggal.getFullYear();
    tanggal = dd + ' ' + mm + ' ' + yyyy;
    let mmKedua = String(kalkulasiTanggal.getMonth() + 1).padStart(2, '0'); //January is 0!
    let tampilanTanggal = yyyy + '-' + mmKedua + '-' + dd
    let sortirTanggal = tampilanTanggal.split('-');
    let tr = document.querySelector('#achievement' + doc.id);
    tr.setAttribute('data-date', sortirTanggal);
    let kontenAchievement = doc.data().kontenAchievement;
    document.querySelector('#tanggal-achievement-table' + doc.id).innerText = tanggal;
    document.querySelector('#tanggal-achievement' + doc.id).innerText = tanggal;
    document.querySelector('#konten-achievement-table' + doc.id).innerText = kontenAchievement;
    document.querySelector('#konten-achievement' + doc.id).innerText = kontenAchievement;

}


const createForm11 = document.querySelector('#tambah-achievement');
createForm11.addEventListener('submit', (e) => {
    e.preventDefault();
    if(document.querySelector('#tanggal-achievement').value == 0){
    let tanggal = new Date().getTime();
    db.collection('achievement').add({
        tanggal: tanggal,
        kontenAchievement: createForm11['konten-achievement'].value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modalachievement').modal('hide');
        document.querySelector('#tambah-achievement').reset();
    })
  } else {
    db.collection('achievement').add({
        tanggal: createForm11['tanggal-achievement'].value,
        kontenAchievement: createForm11['konten-achievement'].value.replace(/\n\r?/g, '<br/>')
    }).then(() => {
        $('#modalachievement').modal('hide');
        document.querySelector('#tambah-achievement').reset();
    })
  }
})





document.querySelector('#konversi-tabel-transaksi').addEventListener('click', () =>{
let date = new Date();
let dd = String(date.getDate()).padStart(2, '0');
let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = date.getFullYear();
date = dd + '_' + mm + '_' + yyyy;
let filename = "Transaksi Berjalan " + date;
let tab_text = "<table border='2px'>";
let textRange;
let j = 0;
tab = document.getElementById('tabel-transaksi');

for (j = 0; j < tab.rows.length; j++) {
  tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
}

tab_text = tab_text + "</table>";
let a = document.createElement('a');
let data_type = 'data:application/vnd.ms-excel';
a.href = data_type + ', ' + encodeURIComponent(tab_text);
a.download = filename + '.xls';
a.click();

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


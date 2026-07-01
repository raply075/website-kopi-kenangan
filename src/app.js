document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Brazil", img: "1.jpg", price: 20000 },
      { id: 2, name: "Arabica Blend", img: "2.jpg", price: 25000 },
      { id: 3, name: "Primo Passo", img: "3.jpg", price: 30000 },
      { id: 4, name: "Campito Bre", img: "4.jpg", price: 35000 },
      { id: 5, name: "Robusta Beans", img: "5.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jikka barang sudah ada di cart apakah beda atau sama
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada,tambah quantity
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation

const checkoutButton = document.querySelector("#checkout-button");

checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();

  console.log("BUTTON CLICK");

  const form = document.querySelector("#checkoutForm");

  const formData = new FormData(form);

  // Simpan hasil form ke variabel
  const objData = Object.fromEntries(formData.entries());

  console.log(objData);

  // Buat pesan WhatsApp
  const message = formatMessage(objData);

  window.open(
    `https://wa.me/6287722590815?text=${encodeURIComponent(message)}`,
  );
});

// format pesan ke whatsapp
const formatMessage = (obj) => {
  return `Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No. HP: ${obj.phone}

Data Pesanan
${JSON.parse(obj.items)
  .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`)
  .join("\n")}

TOTAL: ${rupiah(obj.total)}

TERIMA KASIH`;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const products = [
  {
    // _id: '1',
    name: 'Airpods Wireless Bluetooth Headphones',
    image: [
      {
        public_id:'products/airpods_xyqawf', 
        url: 'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/airpods_xyqawf.jpg'}],
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
    seller: 'Apple',
    category: 'Accessories',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    reviews:[],
  },
  {
    // _id: '2',
    name: 'iPhone 11 Pro 256GB Memory',
    image: [
      { 
        public_id:'products/phone_vyj8at', 
        url: 'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/phone_vyj8at.jpg'
      },
      { 
        public_id:'products/phone_vyj8at', 
        url: 'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/phone_vyj8at.jpg'
      },
      { 
        public_id:'products/phone_vyj8at', 
        url: 'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/phone_vyj8at.jpg'
      }
    ],
    description:
      'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
    seller: 'Apple',
    category: 'Electronics',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
    reviews:[],
  },
  {
    // _id: '3',
    name: 'Cannon EOS 80D DSLR Camera',
    image: [
      {
        public_id:'products/camera_xevqlp', 
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/camera_xevqlp.jpg'
  }],
    description:
      'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
    seller: 'Cannon',
    category: 'Camera',
    price: 929.99,
    countInStock: 5,
    rating: 3,
    numReviews: 12,
    reviews:[],
  },
  {
    // _id: '4',
    name: 'Sony Playstation 4 Pro White Version',
    image:[
      {
        public_id :'playstation_rusgr5', 
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/playstation_rusgr5.jpg'
      },
      {
        public_id :'playstation_rusgr5', 
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/playstation_rusgr5.jpg'
      },
      {
        public_id :'playstation_rusgr5', 
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/playstation_rusgr5.jpg'
      }
    ],
    description:
      'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
    seller: 'Sony',
    category: 'Electronics',
    price: 399.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
    reviews:[],
  },
  {
    // _id: '5',
    name: 'Logitech G-Series Gaming Mouse',
    image: [
      {
        public_id:'products/mouse_vfazhf', 
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/mouse_vfazhf.jpg'}],
    description:
      'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
    seller: 'Logitech',
    category: 'Electronics',
    price: 49.99,
    countInStock: 7,
    rating: 3.5,
    numReviews: 10,
    reviews:[],
  },
  {
    // _id: '6',
    name: 'Amazon Echo Dot 3rd Generation',
    image: [
      {
        public_id:'products/alexa_tc9ugw',
        url:'https://res.cloudinary.com/mamun1535/image/upload/v1614136637/products/alexa_tc9ugw.jpg'}],
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
    seller: 'Amazon',
    category: 'Laptops',
    price: 29.99,
    countInStock: 0,
    rating: 4,
    numReviews: 12,
    reviews:[],
  },
]

module.exports = products

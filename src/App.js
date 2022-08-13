
import { AppBar, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Input, InputLabel, MenuItem, Select, Slider, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import Mainpage from './Components/Mainpage/Mainpage';
import { db } from './Firebase';

function App() {
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/manage-process-app.appspot.com/o/images%2Fplus.png?alt=media&token=73d8c259-82b9-4936-a3c0-9287ab2e72f3"
  
  const [open, setOpen] = useState(false); // Process ekleme 
  const [quantity, setQuantity] = useState(300);
  const [selectedProduct, setSelectedProduct] = useState({ id: "", data: { image: "" } });
  const [products, setProducts] = useState([]);

  const handleAddProcessOpen = () => {// Process ekleme ekranı aç
    setOpen(true);
  };
  const handleAddProcessClose = () => {// Process ekleme ekranı kapa
    setOpen(false);
  };

  function quantityText(value) {
    return `${value}`; // ürün miktarı slider barın anlık değeri
  }

  const handleQuantitySliderChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleQuantityInputChange = (event) => {
    setQuantity(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleQuantitySliderBlur = () => {
    if (quantity < 100) { //ürün miktarı 100-5000 arasında olabilir
      setQuantity(100);
    } else if (quantity > 5000) {
      setQuantity(5000);
    }
  };


  const handleSelectedProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => { //tüm ürünleri veri tabanından çek
    db.collection("products").onSnapshot((product) => {
      setProducts(
        product.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    })
  }, [])

  const addNewProcess = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      db.collection("processes").add({ //fireBase processes collectionuna yeni process ekle
        status:"pending",
        quantity: quantity,
        product: selectedProduct,
        employee: {id:"",data:{name:"",image:imageUrl.toString()}},
        machine: {id:"",data:{name:"",image:imageUrl.toString(), machineCode:""}}
    })
    }
    handleAddProcessClose();
  }

  return (
    <>
      <Dialog open={open} onClose={handleAddProcessClose}>
        <DialogTitle>Add New Process</DialogTitle>
        <DialogContent>

          <DialogContentText>
            You are going to add new process. Be sure to entered values are right.
          </DialogContentText>

          <div className='flex items-center grid grid-cols-2 justify-items-center py-2 '>
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <InputLabel id="select-product">Product</InputLabel>
              <Select
                labelId="select-product"
                id="select-product"
                defaultValue={products[0]}
                value={selectedProduct}
                onChange={handleSelectedProductChange}
                autoWidth
                label="Product"
              >
                {//<MenuItem value={product.id}>{product.data.productName}</MenuItem>
                  products.map((product) =>
                    <MenuItem key={product.id} value={product}>{product.data.name}</MenuItem>
                  )
                }
              </Select>

            </FormControl>
            <Avatar
              className='border border-gray-400 hover:bg-gray-300'
              sx={{ width: 50, height: 50 }}
              src={selectedProduct.data.image}
              variant="rounded">
            </Avatar>
          </div>

          <h2>Set the quantity of product:</h2>
          <Input
            value={quantity}
            size="small"
            onChange={handleQuantityInputChange}
            onBlur={handleQuantitySliderBlur}
            inputProps={{
              step: 100,
              min: 100,
              max: 5000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          <Grid item xs>

            <Slider
              value={typeof quantity === 'number' ? quantity : 100}
              onChange={handleQuantitySliderChange}
              aria-labelledby="input-slider"
              aria-label="Temperature"
              defaultValue={300}
              getAriaValueText={quantityText}
              valueLabelDisplay="auto"
              step={100}
              marks
              min={100}
              max={5000}
            />
          </Grid>
          <Grid item>

          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddProcessClose}>Cancel</Button>
          <Button onClick={addNewProcess}>Add Process</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex' }}>
        <AppBar component="nav" className='bg-gradient-to-r from-[#3949ab] to-[#ba68c8]'>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Manage Process
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button className='rounded-md hover:!bg-[#ab47bc]' sx={{ color: '#fff' }} onClick={handleAddProcessOpen}>Add Process</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>

        </Box>
      </Box>
      <Mainpage></Mainpage>
    </>
  );
}

export default App;

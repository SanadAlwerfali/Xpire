import React, {Component, useEffect} from "react";

import { View, StyleSheet, Text} from "react-native";
import AddItemsModal from "../components/AddItemsModal";

import db from "../firebase";
import { doc } from "firebase/firestore";
import Header from "../components/Header"
import GetItemsComponent from "../components/GetItemsComponent"
import Items from "../components/Items";
import Searchbar from "../components/Searchbar";
import Footer from "../components/Footer";
import bodyStyles from "../styles/bodyStyles";
import { getItems } from "../src/api/ItemsApi";

export default class Home extends Component {

    // const [users, setUsers] = useState();

    // useEffect( () => {
    //     db.collection('users')
    //     .get()
    //     .then(result => result.docs)
    //     .then(docs => docs.map(doc => ({
    //         id: doc.id, 
    //         items: doc.data().items,
    //         name: doc.data().name  
    //     })))
    //     .then (users => setUsers(users))
    // }, [])
    // console.log("users value is " + JSON.stringify(users));
    // const [openModal, setOpenModal] = useState(false);
    // const [product, setProduct] = useState([
    //     {key: 1, name: 'Bread', image:require('../assets/icon.png'), remainingDays: 2, progress: 0.25, progressColor: '#EB5757'},
    //     {key: 2, name: 'Milk', image:require('../assets/splash.png'), remainingDays: 4,progress: 0.5, progressColor: '#F2994A'},
    //     {key: 3, name: 'Yoghurt', image:require('../assets/splash.png'), remainingDays: 7,progress: 0.75, progressColor: '#219653'}
    // ]);
    constructor(props){
        super (props);
        this.state = {
            modalVisible: false,
            search: '',
            filteredUserItems: [],
            masterUserItems: [],
            isLoading: true,
            filteredProducts: [
                    {key: 1, name: 'Bread', image:require('../assets/breadd.png'), remainingDays: 2, progress: 0.25, progressColor: '#EB5757'},
                    {key: 2, name: 'Milk', image:require('../assets/milkImage.png'), remainingDays: 4,progress: 0.5, progressColor: '#F2994A'},
                    {key: 3, name: 'Yogurt', image:require('../assets/yoghurt.png'), remainingDays: 7,progress: 0.75, progressColor: '#219653'},
                    
                ],
            masterProductsData: [
                {key: 1, name: 'Bread', image:require('../assets/icon.png'), remainingDays: 2, progress: 0.25, progressColor: '#EB5757'},
                {key: 2, name: 'Milk', image:require('../assets/splash.png'), remainingDays: 4,progress: 0.5, progressColor: '#F2994A'},
                {key: 3, name: 'Yogurt', image:require('../assets/splash.png'), remainingDays: 7,progress: 0.75, progressColor: '#219653'}
            ],
        }
    }

    updateUserItems = () => {
        console.log("Mounted");
        db.collection('users')
        .get()
        .then(result => result.docs)
        .then((docs) => {
            docs.forEach((doc) => {
                if(doc.id == "sW6JJvJ7Pq7sEnLKaCE1"){
                    this.setState ({
                        filteredUserItems: doc.data()['items'],
                        masterUserItems: doc.data()['items'],
                        isLoading: false,
                    }) 
                    console.log("data from db after component mount is: " , this.state.filteredUserItems);
                } 
            })
        })
        .catch(error => {
            console.error('Couldnt get itmes', error)
        })
    }

    componentDidMount () {
        this.updateUserItems();
    }
    
    setModalVisible = (isModalVisible) => {
        this.setState({modalVisible: isModalVisible});
    }
    

    searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = this.state.masterUserItems.filter(function (item) {
            const itemData = item.name
              ? item.name
              : '';
            const textData = text;
            return itemData.indexOf(textData) > -1;
          });
          this.setState({ filteredUserItems : newData });
          this.setState({ search : text });

        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          const masterUserItems = this.state.masterUserItems;
          this.setState({ filteredUserItems: masterUserItems });
          this.setState({ search : text });
        }
      };
    render() {
        if(this.state.isLoading){
            return (
                <View><Text>Loading</Text></View>
            )
        }
        return(
            <View>
                <Header title="Home" rightHeader="Filter" leftHeader="Profile"/>       
                <View style={bodyStyles.body}>
                    <AddItemsModal  searchFilterFunction= {this.searchFilterFunction} modalVisible={this.state.modalVisible} setModalVisible ={this.setModalVisible} />
                    <Searchbar searchFilterFunction= {this.searchFilterFunction} search={this.state.search}/>
                    <Items filteredUserItems={this.state.filteredUserItems} isLoading={this.state.isLoading}/>
                    
                </View>
                {/* <GetItemsComponent/> */}
                <Footer  modalVisible={this.state.modalVisible} setModalVisible ={this.setModalVisible}/>
            </View>
        
        );
    }
}
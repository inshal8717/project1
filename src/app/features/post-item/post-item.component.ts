import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { MFormUlaComponent } from '../../m-framework/components/m-form-ula/m-form-ula.component';
import { MCardComponent } from '../../m-framework/components/m-card/m-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../m-framework/services/firebase.service';


declare var google:any;

class Item{
  key:string;
  itemName:string;
  itemDescription:string;
  availability:string;
  constructor(key:string, itemName:string, itemDescription:string){
    this.key="";
    this.itemName="";
    this.itemDescription="";
    this.availability="";
    
  }
}


@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [MContainerComponent, CommonModule, FormsModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})



export class PostItemComponent {
  //For the location
  latitude: number;
  longitude: number;
  currentLocation: any;

  map: any;
  mapElementRef: any;

  display: any;

  constructor()
  {
    this.latitude = 0;
    this.longitude = 0;

    this.display = new google.maps.DirectionsRenderer();
  }

  drawRoute(startLat: number, startLng: number, endLat: number, endLng: number)
  {
    let service = new google.maps.DirectionsService();
    this.display.setMap(this.map);

    let request = {
      origin: {lat: startLat, lng: startLng},
      destination: {lat: endLat, lng: endLng},
      travelMode: google.maps.TravelMode.DRIVING,
    };

    service.route(request, (result: any, status: any) =>{
      if(status == 'OK')
      {
        this.display.setDirections(result);
      }
    });
  }

  async GooglePlacesNearbySearch(currentLocation: any)
  {
    let firstLocation: boolean = false;
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
    
    let center = new google.maps.LatLng(this.latitude, this.longitude);

    const request = {
      locationRestriction: {
        center: center,
        radius: 5000, 
      },
      fields: ['displayName', 'location'],
      rankPreference: SearchNearbyRankPreference.DISTANCE,
      includedPrimaryTypes: ['location']
    };

    //@ts-ignore
    const { places } = await Place.searchNearby(request);

    if (places.length) 
      {
        places.forEach((place: any) => {
        if(place !== null)
        {
          this.addMarker(place.location.lat(), place.location.lng(), place.displayName, "https://i.ibb.co/JFyCm18Q/hospital-icon.png");
          if(firstLocation == false) // if I get first hospital location, I display a direction route from my location to that hospital
          {
            firstLocation = true;
            this.drawRoute(this.latitude, this.longitude, place.location.lat(), place.location.lng());
          }
        }
      });

    } 
    else 
    {
      console.log("No results");
    }
  }

  getPosition()
  {
    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition((data) => {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.loadMap();
      });
    }
  }

  loadMap()
  {
    this.getPosition();

    let mapOptions = {
      center:{lat: this.latitude, lng: this.longitude},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.mapElementRef = document.getElementById('map');
    this.map = new google.maps.Map(this.mapElementRef, mapOptions);

    const image = "https://i.ibb.co/DPkxZ78v/marker-img.png";
    let marker = this.addMarker(this.latitude, this.longitude, "My Current Location", image);

    this.GooglePlacesNearbySearch(this.currentLocation);    
  }

  addMarker(latitude: number, longitude: number, placeName:string, image:any)
  {
    const marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: this.map,
      icon: image
    });

    let infowindow = new google.maps.InfoWindow(
      {
        content: "<div style='color: #000; background: #FFF;'>"+ placeName + "</div>"
      });

    google.maps.event.addListener(marker, 'click', ()=> {
      infowindow.open(this.map, marker);
    });

    return marker;
  }

  ngOnInit() // angular constructor
  {
    this.loadMap();
  }




}

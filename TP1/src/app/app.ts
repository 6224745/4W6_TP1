  import { Component, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Album } from './models/Albums';
import { Song } from './models/Song';

@Component({
  selector: 'app-root',
  
  imports: [RouterOutlet ,CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TP1');

  constructor(public http : HttpClient){}

  serchName : string = "";
  artistName : string = "";
  albumList : Album[] = [];
  songList : Song[] = [];
  message : string = "";

  async getArtistAlbum(){
    this.artistName = this.serchName;
    this.albumList = [];
    let x = await lastValueFrom(this.http.get<any>("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+ this.artistName +"&api_key=9a8a3facebbccaf363bb9fd68fa37abf&format=json"));
    this.serchName = "";
    console.log(x);
    for(let alb of x.topalbums.album)
    {
      this.albumList.push(new Album(alb.name, alb.image[2]['#text']))
    }
  }

  async getAlbumSongs(albumName : string){
    this.songList = [];
    let x = await lastValueFrom(this.http.get<any>("http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9a8a3facebbccaf363bb9fd68fa37abf&artist="+ this.artistName +"&album="+ albumName  +"&format=json"));
    console.log(x);
    for(let song of x.album.tags.tag)
    {
      this.songList.push(new Song(song.name))
    }
  }
}

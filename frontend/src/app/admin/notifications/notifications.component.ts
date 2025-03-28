import { Component } from '@angular/core';

@Component({
  selector: 'ums-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  notifications = [
    {
      id: 1,
      sender: "John Doe",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'commented on your review of "Inception"',
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      sender: "Jane Smith",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'liked your comment on "The Shawshank Redemption"',
      time: "1 day ago",
      isRead: true,
    },
    {
      id: 3,
      sender: "Movie Club",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: "New movies added to your watchlist!",
      time: "3 days ago",
      isRead: false,
    },
    {
      id: 4,
      sender: "Alex Johnson",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'liked your review of "The Dark Knight"',
      time: "4 hours ago",
      isRead: false,
    },
    {
      id: 5,
      sender: "Emma Watson",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'replied to your comment on "Interstellar"',
      time: "5 hours ago",
      isRead: true,
    },
    {
      id: 6,
      sender: "Movie Club",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: "Don't forget to check out the new movies added to your favorites!",
      time: "2 days ago",
      isRead: true,
    },
    {
      id: 7,
      sender: "Lucas Green",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'commented on your review of "Fight Club"',
      time: "1 week ago",
      isRead: false,
    },
    {
      id: 8,
      sender: "Sara Lee",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'liked your comment on "The Godfather"',
      time: "2 days ago",
      isRead: false,
    },
    {
      id: 9,
      sender: "Movie Club",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: "You have new recommendations based on your watchlist!",
      time: "4 days ago",
      isRead: true,
    },
    {
      id: 10,
      sender: "Tom Hanks",
      profilePic: "https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE=",
      text: 'liked your review of "Forrest Gump"',
      time: "6 hours ago",
      isRead: false,
    },
  ];


}

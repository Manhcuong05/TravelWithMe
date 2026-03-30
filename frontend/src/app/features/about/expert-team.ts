import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-expert-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="expert-team-page animate-fade-in">
      <div class="hero-section text-center">
        <div class="overlay"></div>
        <div class="container hero-content">
          <span class="pro-tag">Đội Ngũ Sáng Lập</span>
          <h1 class="luxury-font main-title">Những Người Kiến Tạo Giấc Mơ</h1>
          <p class="subtitle text-reveal">Chúng tôi là nhóm 5 sinh viên từ Đại học CMC, kết hợp sức trẻ và công nghệ để định nghĩa lại hành trình du lịch của bạn.</p>
        </div>
      </div>

      <div class="container team-grid">
        <div *ngFor="let member of teamMembers(); let i = index" 
             class="expert-card-pro glass-card animate-slide-up" 
             [style.--delay]="(i * 0.1 + 0.1) + 's'">
          
          <div class="expert-image-wrapper-pro">
             <!-- Profile Image or Placeholder -->
             <img *ngIf="member.image" [src]="member.image" class="expert-profile-img" [alt]="member.name">
             
             <div *ngIf="!member.image" class="image-placeholder-pro">
                <i [class]="member.icon"></i>
                <span class="placeholder-text luxury-font">{{ member.tag }}</span>
             </div>

             <!-- Floating Upload Button - Only for Admin/CTV -->
             <div *ngIf="canEdit()" class="upload-overlay">
                <label [for]="'upload-' + i" class="btn-upload-avatar">
                   <i class="fas fa-camera"></i>
                   <span>Đổi ảnh</span>
                </label>
                <input type="file" [id]="'upload-' + i" hidden accept="image/*" (change)="onFileSelected($event, i)">
             </div>
          </div>

          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">{{ member.name }}</h3>
            <p class="expert-bio">{{ member.bio }}</p>
            <div class="social-links-pro">
              <a *ngFor="let link of member.socials" [href]="link.url"><i [class]="link.icon"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="container joining-section mt-100 text-center">
        <div class="glass-card promo-box-pro">
          <h2 class="luxury-font section-title">Cùng Chúng Tôi Chinh Phục Thế Giới</h2>
          <p>Dự án đang trong giai đoạn phát triển bùng nổ bởi tâm huyết của những sinh viên CMC.</p>
          <button class="btn-gold-pro mt-30">LIÊN HỆ HỢP TÁC</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #AA8A2E; --bg-dark: #0a0a0b; --glass-bg: rgba(255, 255, 255, 0.02); --glass-border: rgba(255, 255, 255, 0.08); }
    
    .expert-team-page { padding: 120px 0 100px; background: var(--bg-dark); min-height: 100vh; color: #fff; }
    
    .hero-section { 
      position: relative; padding: 100px 0; 
      background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
      margin-bottom: 80px;
    }
    .hero-content { position: relative; z-index: 2; }
    
    .container { max-width: 1300px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mt-100 { margin-top: 100px; }
    .mt-30 { margin-top: 30px; }
    
    .pro-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 6px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; 
      text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }
    .main-title { font-size: clamp(2.5rem, 5vw, 3.5rem); margin-bottom: 25px; }
    .subtitle { color: rgba(255,255,255,0.7); font-size: 1.2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }

    .team-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
      gap: 30px; 
      justify-content: center;
    }
    
    .glass-card { 
      background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border); border-radius: 24px; transition: 0.4s;
    }
    .glass-card:hover { border-color: rgba(212, 175, 55, 0.4); transform: translateY(-10px); background: rgba(255,255,255,0.04); }

    .expert-card-pro { display: flex; flex-direction: column; overflow: hidden; position: relative; }
    
    .expert-image-wrapper-pro { 
      height: 320px; position: relative; background: rgba(0,0,0,0.2); 
      display: flex; align-items: center; justify-content: center;
      border-bottom: 1px solid var(--glass-border);
      overflow: hidden;
    }
    .expert-profile-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .expert-card-pro:hover .expert-profile-img { transform: scale(1.1) rotate(1deg); }
    
    .image-placeholder-pro { 
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; 
      transition: 0.3s; color: rgba(212, 175, 55, 0.15); 
    }
    .expert-card-pro:hover .image-placeholder-pro { color: var(--gold-primary); transform: scale(1.1); }
    .image-placeholder-pro i { font-size: 5rem; }
    .placeholder-text { font-size: 1.2rem; letter-spacing: 4px; opacity: 0.5; }
    
    .expert-info-pro { padding: 35px; flex: 1; display: flex; flex-direction: column; }
    .expert-info-pro h3 { font-size: 1.6rem; margin-bottom: 8px; transition: 0.3s; }
    .expert-card-pro:hover h3 { color: #fff; text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
    
    .expert-role { color: var(--gold-primary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; display: block; }
    .expert-bio { color: rgba(255,255,255,0.6); line-height: 1.7; font-size: 0.95rem; margin-bottom: 25px; flex: 1; }
    
    .social-links-pro { display: flex; gap: 18px; margin-top: auto; }
    .social-links-pro a { color: rgba(255,255,255,0.3); font-size: 1.3rem; transition: 0.3s; }
    .social-links-pro a:hover { color: var(--gold-primary); transform: translateY(-3px); }

    /* Upload UI LUXURY */
    .upload-overlay {
       position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
       display: flex; align-items: center; justify-content: center;
       opacity: 0; transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
       backdrop-filter: blur(5px);
    }
    .expert-card-pro:hover .upload-overlay { opacity: 1; }
    
    .btn-upload-avatar {
       background: rgba(212, 175, 55, 0.2); border: 1px solid var(--gold-primary);
       color: #fff; padding: 12px 24px; border-radius: 50px; cursor: pointer;
       display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.85rem;
       transition: 0.3s;
    }
    .btn-upload-avatar:hover { background: var(--gold-primary); color: #000; transform: scale(1.05); }

    .promo-box-pro { padding: 80px 40px; border-style: dashed; }
    .section-title { font-size: 2.22rem; margin-bottom: 20px; color: var(--gold-primary); }

    .btn-gold-pro {
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
      color: #000; border: none; padding: 18px 40px; border-radius: 12px;
      font-weight: 800; font-size: 0.9rem; letter-spacing: 2px;
      cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
    }
    .btn-gold-pro:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

    /* Animations */
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1200px) {
      .team-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .team-grid { grid-template-columns: 1fr; }
      .main-title { font-size: 2.5rem; }
      .promo-box-pro { padding: 50px 24px; }
      .expert-image-wrapper-pro { height: 280px; }
    }
  `]
})
export class ExpertTeamComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  canEdit = computed(() => {
    const user = this.authService.currentUser();
    return user && (user.role === 'ADMIN' || user.role === 'CTV');
  });

  teamMembers = signal([
    {
      id: 'TEAM_MEMBER_0_AVATAR',
      name: 'Nguyễn Mạnh Cường',
      tag: 'LEADER',
      icon: 'fas fa-user-tie',
      bio: 'Với tâm thế luôn học hỏi và dẫn dắt bằng khát vọng, tôi nỗ lực kết nối mọi nguồn lực để cùng các đồng nghiệp tạo nên một nền tảng du lịch hiện đại, đẳng cấp và giàu tính nhân văn.',
      image: null as string | null,
      socials: [{ icon: 'fab fa-github', url: '#' }, { icon: 'fab fa-linkedin', url: '#' }]
    },
    {
      id: 'TEAM_MEMBER_1_AVATAR',
      name: 'Vũ Minh Hiển',
      tag: 'FRONTEND',
      icon: 'fas fa-code',
      bio: 'Với niềm đam mê thiết kế giao diện từ những ngày đầu, tôi luôn nỗ lực biến những ý tưởng phức tạp thành những trải nghiệm đơn giản, tinh tế và sang trọng nhất cho người dùng.',
      image: null as string | null,
      socials: [{ icon: 'fab fa-github', url: '#' }, { icon: 'fab fa-behance', url: '#' }]
    },
    {
      id: 'TEAM_MEMBER_2_AVATAR',
      name: 'Nguyễn Hoàng Duy',
      tag: 'BACKEND',
      icon: 'fas fa-database',
      bio: 'Tôi tin rằng một hệ thống vững chắc là nền tảng của mọi chuyến đi hoàn hảo. Tôi tập trung vào việc xử lý dữ liệu thông minh để mọi thao tác của khách hàng luôn mượt mà và an toàn.',
      image: null as string | null,
      socials: [{ icon: 'fab fa-github', url: '#' }, { icon: 'fab fa-docker', url: '#' }]
    },
    {
      id: 'TEAM_MEMBER_3_AVATAR',
      name: 'Bùi Xuân Quân',
      tag: 'UI/UX',
      icon: 'fas fa-paint-brush',
      bio: 'Sáng tạo không ranh giới là tôn chỉ của tôi. Tôi dành trọn tâm huyết để thiết kế nên những hành trình không chỉ đẹp về thị giác mà còn chạm đến cảm xúc của mỗi lữ khách.',
      image: null as string | null,
      socials: [{ icon: 'fab fa-dribbble', url: '#' }, { icon: 'fab fa-figma', url: '#' }]
    },
    {
      id: 'TEAM_MEMBER_4_AVATAR',
      name: 'Chu Văn Sơn',
      tag: 'AI/DATA',
      icon: 'fas fa-brain',
      bio: 'Đưa trí tuệ nhân tạo vào thực tế cuộc sống là mục tiêu lớn nhất của tôi. Tôi mong muốn mỗi gợi ý trong TravelWithMe đều như một người bạn thực thụ hiểu rõ mong muốn của bạn.',
      image: null as string | null,
      socials: [{ icon: 'fab fa-github', url: '#' }, { icon: 'fab fa-python', url: '#' }]
    }
  ]);

  ngOnInit() {
    this.loadTeamImages();
  }

  loadTeamImages() {
    // Tải toàn bộ ảnh từ system_settings
    this.http.get<any>('/api/admin/settings').pipe(take(1)).subscribe(res => {
      const settings = res.data || [];
      this.teamMembers.update(members => {
        return members.map(m => {
          const setting = settings.find((s: any) => s.id === m.id);
          return { ...m, image: setting ? setting.value : m.image };
        });
      });
    });
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    const member = this.teamMembers()[index];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('settingKey', member.id);

      this.http.post<any>('/api/upload', formData).subscribe(res => {
        if (res.data) {
          this.teamMembers.update(members => {
            const newMembers = [...members];
            newMembers[index].image = res.data;
            return newMembers;
          });
        }
      });
    }
  }
}

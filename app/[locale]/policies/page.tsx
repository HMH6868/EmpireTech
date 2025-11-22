'use client';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-locale';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const copy = {
  title: {
    en: 'Policies & Contact',
    vi: 'Chính sách & Liên hệ',
  },
  description: {
    en: 'Important information and how to reach us',
    vi: 'Thông tin quan trọng và cách liên hệ với chúng tôi',
  },
  sections: [
    {
      id: 'terms',
      title: { en: 'Terms of Service', vi: 'Điều khoản dịch vụ' },
      content: [
        {
          type: 'p',
          text: {
            en: 'Welcome to Empire Tech. By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
            vi: 'Chào mừng bạn đến với Empire Tech. Khi truy cập hoặc sử dụng nền tảng, bạn đồng ý tuân thủ các điều khoản dịch vụ và mọi quy định pháp luật hiện hành.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Account Usage', vi: 'Sử dụng tài khoản' },
        },
        {
          type: 'p',
          text: {
            en: 'All digital accounts sold on our platform are for personal use only. Sharing, reselling, or redistributing purchased accounts is prohibited.',
            vi: 'Mọi tài khoản số bán trên nền tảng chỉ dành cho mục đích cá nhân. Nghiêm cấm chia sẻ, bán lại hoặc phân phối lại các tài khoản đã mua.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Intellectual Property', vi: 'Quyền sở hữu trí tuệ' },
        },
        {
          type: 'p',
          text: {
            en: 'All content on Empire Tech is protected by international copyright laws. Any unauthorized use is strictly prohibited.',
            vi: 'Mọi nội dung trên Empire Tech được bảo vệ bởi luật bản quyền quốc tế. Nghiêm cấm mọi hành vi sử dụng trái phép.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Limitation of Liability', vi: 'Giới hạn trách nhiệm' },
        },
        {
          type: 'p',
          text: {
            en: 'Empire Tech is not liable for indirect, incidental, or consequential damages arising from the use of our services.',
            vi: 'Empire Tech không chịu trách nhiệm đối với các thiệt hại gián tiếp, ngẫu nhiên hoặc do hậu quả phát sinh từ việc sử dụng dịch vụ.',
          },
        },
      ],
    },
    {
      id: 'privacy',
      title: { en: 'Privacy Policy', vi: 'Chính sách bảo mật' },
      content: [
        {
          type: 'p',
          text: {
            en: 'We value your privacy. This policy explains what data we collect, how we use it, and how we keep it safe.',
            vi: 'Chúng tôi coi trọng quyền riêng tư của bạn. Chính sách này giải thích dữ liệu được thu thập, cách sử dụng và biện pháp bảo vệ.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Information We Collect', vi: 'Dữ liệu chúng tôi thu thập' },
        },
        {
          type: 'p',
          text: {
            en: 'We collect information you provide directly, including name, email, payment info, and messages sent to support.',
            vi: 'Chúng tôi thu thập thông tin bạn cung cấp trực tiếp như tên, email, thông tin thanh toán và nội dung gửi đến bộ phận hỗ trợ.',
          },
        },
        {
          type: 'h3',
          text: { en: 'How We Use Your Information', vi: 'Cách chúng tôi sử dụng dữ liệu' },
        },
        {
          type: 'p',
          text: {
            en: 'Data is used to deliver services, process transactions, send updates, and improve user experience.',
            vi: 'Dữ liệu được dùng để cung cấp dịch vụ, xử lý giao dịch, gửi thông báo và cải thiện trải nghiệm người dùng.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Data Security', vi: 'Bảo mật dữ liệu' },
        },
        {
          type: 'p',
          text: {
            en: 'We implement technical and organizational measures to protect your information, though no method is 100% secure.',
            vi: 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ thông tin, tuy nhiên không phương thức nào đảm bảo an toàn tuyệt đối.',
          },
        },
      ],
    },
    {
      id: 'refund',
      title: { en: 'Refund Policy', vi: 'Chính sách hoàn tiền' },
      content: [
        {
          type: 'p',
          text: {
            en: 'We aim for complete satisfaction. If a product fails to work as described, contact us within 48 hours for support or refund consideration.',
            vi: 'Chúng tôi mong muốn bạn hài lòng tuyệt đối. Nếu sản phẩm không hoạt động đúng mô tả, hãy liên hệ trong vòng 48 giờ để được hỗ trợ hoặc xem xét hoàn tiền.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Eligibility', vi: 'Điều kiện' },
        },
        {
          type: 'p',
          text: {
            en: 'Eligible refunds require proof of issue, unused credentials, and cooperation during troubleshooting.',
            vi: 'Để đủ điều kiện hoàn tiền, cần có bằng chứng lỗi, tài khoản chưa sử dụng và hợp tác khi kiểm tra.',
          },
        },
        {
          type: 'h3',
          text: { en: 'Non-Refundable Items', vi: 'Các trường hợp không hoàn tiền' },
        },
        {
          type: 'p',
          text: {
            en: 'Courses already accessed and accounts delivered in working condition are non-refundable.',
            vi: 'Khóa học đã truy cập và tài khoản đã bàn giao hoạt động bình thường sẽ không được hoàn tiền.',
          },
        },
      ],
    },
  ],
  contactCard: {
    title: { en: 'Contact Us', vi: 'Liên hệ với chúng tôi' },
    subtitle: {
      en: "Have questions? We're here to help",
      vi: 'Có thắc mắc? Chúng tôi luôn sẵn sàng hỗ trợ',
    },
  },
  form: {
    nameLabel: { en: 'Name', vi: 'Họ và tên' },
    namePlaceholder: { en: 'Your name', vi: 'Nhập họ tên' },
    emailLabel: { en: 'Email', vi: 'Email' },
    emailPlaceholder: { en: 'you@example.com', vi: 'ban@example.com' },
    messageLabel: { en: 'Message', vi: 'Nội dung' },
    messagePlaceholder: { en: 'How can we help?', vi: 'Bạn cần hỗ trợ gì?' },
    submit: { en: 'Send Message', vi: 'Gửi tin nhắn' },
    sending: { en: 'Sending...', vi: 'Đang gửi...' },
    toastTitle: { en: 'Message sent', vi: 'Đã gửi tin nhắn' },
    toastDesc: {
      en: "We'll get back to you as soon as possible.",
      vi: 'Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
    },
  },
  contactInfo: {
    heading: { en: 'Get in Touch', vi: 'Kết nối với chúng tôi' },
    email: { en: 'Email', vi: 'Email' },
    phone: { en: 'Phone', vi: 'Điện thoại' },
    address: { en: 'Address', vi: 'Địa chỉ' },
    emailValue: 'support@empiretech.com',
    phoneValue: '+1 (555) 123-4567',
    addressValue: '123 Tech Street, Digital City',
  },
};

export default function PoliciesPage() {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: copy.form.toastTitle[locale],
        description: copy.form.toastDesc[locale],
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
              {copy.title[locale]}
            </h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">
              {copy.description[locale]}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              {copy.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2 className="text-2xl font-bold">{section.title[locale]}</h2>
                  <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                    {section.content.map((block, index) =>
                      block.type === 'h3' ? (
                        <h3 key={index} className="text-lg font-semibold text-foreground">
                          {block.text[locale]}
                        </h3>
                      ) : (
                        <p key={index}>{block.text[locale]}</p>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card id="contact">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold">{copy.contactCard.title[locale]}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {copy.contactCard.subtitle[locale]}
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{copy.form.nameLabel[locale]}</Label>
                        <Input
                          id="name"
                          placeholder={copy.form.namePlaceholder[locale]}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{copy.form.emailLabel[locale]}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={copy.form.emailPlaceholder[locale]}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{copy.form.messageLabel[locale]}</Label>
                        <Textarea
                          id="message"
                          placeholder={copy.form.messagePlaceholder[locale]}
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? copy.form.sending[locale] : copy.form.submit[locale]}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{copy.contactInfo.heading[locale]}</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{copy.contactInfo.email[locale]}</p>
                          <p className="text-sm text-muted-foreground">
                            {copy.contactInfo.emailValue}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{copy.contactInfo.phone[locale]}</p>
                          <p className="text-sm text-muted-foreground">
                            {copy.contactInfo.phoneValue}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{copy.contactInfo.address[locale]}</p>
                          <p className="text-sm text-muted-foreground">
                            {copy.contactInfo.addressValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

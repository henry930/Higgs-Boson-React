import { supabase } from '../lib/supabase';

interface NewsletterSubscription {
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

export class NewsletterService {
  static async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Check if email already exists
      const { data: existingSubscription, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing subscription:', checkError);
        return { success: false, message: 'Failed to process subscription' };
      }

      if (existingSubscription) {
        if (existingSubscription.status === 'active') {
          return { success: false, message: 'This email is already subscribed to our newsletter' };
        } else {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from('newsletter_subscriptions')
            .update({ 
              status: 'active',
              subscribed_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase());

          if (updateError) {
            console.error('Error reactivating subscription:', updateError);
            return { success: false, message: 'Failed to reactivate subscription' };
          }

          return { success: true, message: 'Successfully reactivated your newsletter subscription!' };
        }
      }

      // Create new subscription
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.toLowerCase(),
            subscribed_at: new Date().toISOString(),
            status: 'active'
          }
        ]);

      if (insertError) {
        console.error('Error creating subscription:', insertError);
        return { success: false, message: 'Failed to subscribe. Please try again.' };
      }

      return { success: true, message: 'Successfully subscribed to our newsletter!' };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  }

  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ status: 'unsubscribed' })
        .eq('email', email.toLowerCase());

      if (error) {
        console.error('Error unsubscribing:', error);
        return { success: false, message: 'Failed to unsubscribe. Please try again.' };
      }

      return { success: true, message: 'Successfully unsubscribed from newsletter' };
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  }

  static async getSubscriptions(): Promise<NewsletterSubscription[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('status', 'active')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }
}

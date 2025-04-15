import supabase from '../config/supabase';
import { getMessagesBySwap, sendMessage } from '../services/messageService';

jest.mock(supabase, () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockResolvedValue({ error: null }),
  })),
}));

describe('messageService', () => {
  test('getMessagesBySwap returns messages array', async () => {
    const messages = await getMessagesBySwap('swap123');
    expect(messages).toEqual([]);
  });

  test('sendMessage inserts message without error', async () => {
    await expect(
      sendMessage({
        swap_id: 'swap123',
        sender_id: 'worker1',
        recipient_id: 'worker2',
        content: 'Hola!',
      })
    ).resolves.toBeUndefined();
  });
});

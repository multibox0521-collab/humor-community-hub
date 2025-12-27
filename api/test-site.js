import axios from 'axios';
import * as cheerio from 'cheerio';

// CORS 헤더 설정
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 테스트 핸들러
export default async function handler(req, res) {
  setCORS(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { site } = req.query;
  
  if (!site) {
    return res.status(400).json({
      error: '사이트를 지정해주세요. 예: /api/test-site?site=clien'
    });
  }

  try {
    let result = {};
    
    // 클리앙 테스트
    if (site === 'clien') {
      const { data } = await axios.get('https://www.clien.net/service/board/park?&od=T31&po=0', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('.list_item').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.subject_fixed').text().trim();
        const href = $(el).find('.list_subject a').attr('href');
        const link = href ? 'https://www.clien.net' + href : '';
        if (title && link) posts.push({ title, link });
      });
      result = { site: '클리앙', success: true, count: posts.length, posts };
    }
    
    // SLR클럽 테스트
    else if (site === 'slrclub') {
      const { data } = await axios.get('https://www.slrclub.com/bbs/zboard.php?id=free', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('table.list_table tbody tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.sbj a').text().trim();
        const href = $(el).find('.sbj a').attr('href');
        const link = href ? 'https://www.slrclub.com/bbs/' + href : '';
        if (title && link) posts.push({ title, link });
      });
      result = { site: 'SLR클럽', success: true, count: posts.length, posts };
    }
    
    // 뽐뿌 테스트
    else if (site === 'ppomppu') {
      const { data } = await axios.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('table.board_table tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.list_title a').text().trim();
        const href = $(el).find('.list_title a').attr('href');
        const link = href ? 'https://www.ppomppu.co.kr/zboard/' + href : '';
        if (title && link && !link.includes('undefined')) posts.push({ title, link });
      });
      result = { site: '뽐뿌', success: true, count: posts.length, posts };
    }
    
    // 개드립 테스트
    else if (site === 'dogdrip') {
      const { data } = await axios.get('https://www.dogdrip.net/dogdrip', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('.ed .title a').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).text().trim();
        const link = 'https://www.dogdrip.net' + $(el).attr('href');
        if (title && link) posts.push({ title, link });
      });
      result = { site: '개드립', success: true, count: posts.length, posts };
    }
    
    // 오늘의유머 테스트
    else if (site === 'todayhumor') {
      const { data } = await axios.get('http://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('.table_list tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.subject a').text().trim();
        const href = $(el).find('.subject a').attr('href');
        const link = href ? 'http://www.todayhumor.co.kr' + href : '';
        if (title && link) posts.push({ title, link });
      });
      result = { site: '오늘의유머', success: true, count: posts.length, posts };
    }
    
    // 에펨코리아 테스트
    else if (site === 'fmkorea') {
      const { data } = await axios.get('https://www.fmkorea.com/best', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('.list-table tbody tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.hx a').text().trim();
        const href = $(el).find('.hx a').attr('href');
        const link = href ? 'https://www.fmkorea.com' + href : '';
        if (title && link) posts.push({ title, link });
      });
      result = { site: '에펨코리아', success: true, count: posts.length, posts };
    }
    
    // 보배드림 테스트
    else if (site === 'bobae') {
      const { data } = await axios.get('https://www.bobaedream.co.kr/cyber/CyberCommunity.php?gubun=K', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('tr.pl10').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.pl14 a').text().trim();
        const href = $(el).find('.pl14 a').attr('href');
        const link = href ? 'https://www.bobaedream.co.kr' + href : '';
        if (title && link && !link.includes('undefined')) posts.push({ title, link });
      });
      result = { site: '보배드림', success: true, count: posts.length, posts };
    }
    
    // 인벤 테스트
    else if (site === 'inven') {
      const { data } = await axios.get('https://www.inven.co.kr/board/webzine/3371', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('.board-list tbody tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('.subject a').text().trim();
        const href = $(el).find('.subject a').attr('href');
        const link = href ? 'https://www.inven.co.kr' + href : '';
        if (title && link && !link.includes('undefined')) posts.push({ title, link });
      });
      result = { site: '인벤', success: true, count: posts.length, posts };
    }
    
    // MLB파크 테스트
    else if (site === 'mlbpark') {
      const { data } = await axios.get('http://mlbpark.donga.com/mp/b.php?m=search&b=bullpen&query=&select=stt&user=&sia=&emd=&sdt=&edt=&ct=1', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      const $ = cheerio.load(data);
      const posts = [];
      $('table.tbl_type01 tr').each((i, el) => {
        if (i >= 3) return false;
        const title = $(el).find('td.tit a').text().trim();
        const href = $(el).find('td.tit a').attr('href');
        const link = href ? 'http://mlbpark.donga.com' + href : '';
        if (title && link) posts.push({ title, link });
      });
      result = { site: 'MLB파크', success: true, count: posts.length, posts };
    }
    
    else {
      return res.status(400).json({
        error: '알 수 없는 사이트입니다.',
        available: ['clien', 'slrclub', 'ppomppu', 'dogdrip', 'todayhumor', 'fmkorea', 'bobae', 'inven', 'mlbpark']
      });
    }
    
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({
      site: site,
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
